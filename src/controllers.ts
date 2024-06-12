import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {Contact} from './modal';

//this function will change primary contacts to secondary contacts
const solve = async (existingContacts: Contact[]) => {

    //filtering all primary contacts
    let primaryContacts: Contact[] | undefined = existingContacts.filter(contact => contact.linkPrecedence === 'primary');

    //if there is one primary contacts then there is no need to make any chnages in db
    if(primaryContacts.length < 2){
        return;
    }

    const allDirectlyConnectedRows: Contact[] = [];

    //finding all secondary conatacts that are linked to primary contacts
    for (const primaryContact of primaryContacts) {
        const directlyConnectedRows = await Contact.findAll({
            where: {
                [Op.or]: [
                    { id: primaryContact.id },
                    { linkedId: primaryContact.id }
                ],
            },
        });

        allDirectlyConnectedRows.push(...directlyConnectedRows);
    }

    //chnaging all primary contacts to secondary contacts except first primary contacts
    // also changing linkedid of secondary contacts and pointing to first primary contacts
    for(let i=1;i<allDirectlyConnectedRows.length;i++){
        // console.log(allDirectlyConnectedRows[i]);
        await allDirectlyConnectedRows[i].update({
            linkedId: allDirectlyConnectedRows[0].id,
            linkPrecedence: 'secondary',
        });

    }
};

export const identifyContact = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'At least one of email or phoneNumber is required.' });
    }

    try {
        const whereConditions = [];
        if (email !== null) whereConditions.push({ email });
        if (phoneNumber !== null) whereConditions.push({ phoneNumber });

        const existingContacts = await Contact.findAll({
            where: {
                [Op.or]: whereConditions,
            },
        });

        if (existingContacts.length === 0) {
            // No existing contacts, create a new primary contact
            const newContact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: 'primary',
            });

            return res.status(200).json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: [],
                },
            });
        }

        // updating existing contacts
        await solve(existingContacts);

        let primaryContact: Contact | undefined = existingContacts.find(contact => contact.linkPrecedence === 'primary');
        let allContacts: Contact[] = [];

        if (primaryContact) {
            // If primary contact is found, finding all linked contacts
            allContacts = await Contact.findAll({
                where: {
                    [Op.or]: [
                        { id: primaryContact.id },
                        { linkedId: primaryContact.id }
                    ]
                },
            });
        } else {
            // If no primary contact, fallback to secondary contact
            const secondaryContact = existingContacts.find(contact => contact.linkPrecedence === 'secondary');
            if (secondaryContact) {
                allContacts = await Contact.findAll({
                    where: {
                        [Op.or]: [
                            { id: secondaryContact.linkedId },
                            { linkedId: secondaryContact.linkedId }
                        ]
                    },
                });

                // Identify the primary contact based on the linked ID of the secondary contact
                primaryContact = allContacts.find(contact => contact.id === secondaryContact.linkedId) || secondaryContact;
            }
        }

        //filtering all emails
        const emails = [...new Set(allContacts.map(contact => contact?.email).filter(email => email))];

        //filtering all phonenumbers
        const phoneNumbers = [...new Set(allContacts.map(contact => contact?.phoneNumber).filter(phoneNumber => phoneNumber))];

        const secondaryContactIds = allContacts.filter(contact => contact?.linkPrecedence === 'secondary').map(contact => contact?.id);

        // Checking if new information needs to be added when either is emaol or phonenumber is present and another field is not present in db
        let newSecondaryContact = null;
        if ((email && !emails.includes(email)) || (phoneNumber && !phoneNumbers.includes(phoneNumber))) {
            newSecondaryContact = await Contact.create({
                email,
                phoneNumber,
                linkedId: primaryContact?.id,
                linkPrecedence: 'secondary',
            });
            secondaryContactIds.push(newSecondaryContact.id);
        }

        res.status(200).json({
            contact: {
                primaryContactId: primaryContact?.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};