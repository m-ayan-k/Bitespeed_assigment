import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

class Contact extends Model {
    public id!: number;
    public phoneNumber?: string;
    public email?: string;
    public linkedId?: number;
    public linkPrecedence!: 'primary' | 'secondary';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public deletedAt?: Date;
}

Contact.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'Contacts',
    timestamps: true,
    paranoid: true,
});

export { Contact };
