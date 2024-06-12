## Wait for 2-3 mins to start the render server.

# Backend Task: Identity Reconciliation

## Description

The system will manage contact information in a database table named Contact, where each row represents a customer's contact details. Customers can have multiple rows, with the oldest marked as "primary" and others as "secondary." Contacts are linked if they share an email address or phone number.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/m-ayan-k/Bitespeed_assigment.git

# Routes

## Adding new data
- **URL:** `https://bitespeed-assigment.onrender.com/api/identify`
- **Method:** `POST`
- **Description:** Adds new data or update primary contacts to secondary contacts.

## Delete All data
- **URL:** `https://bitespeed-assigment.onrender.com/api/delete-all`
- **Method:** `DELETE`
- **Description:** Deletes all rows from table.

## Get All data
- **URL:** `https://bitespeed-assigment.onrender.com/api/contacts`
- **Method:** `GET`
- **Description:** Retrieves all contacts

## Delete Contacts by ID
- **URL:** `/contacts/:id`
- **Method:** `DELETE`
- **Description:** Deletes a contact by ID and all secondary contacts that are linked to this id.


