import {sequelize} from '../db.js'
import {DataTypes} from "sequelize";

export const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    age: {type: DataTypes.INTEGER},
    image: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING},
    university: {type: DataTypes.STRING}
})

export const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    title: {type: DataTypes.STRING},
    content: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
    likes: {type: DataTypes.INTEGER},
    creationDate: {type: DataTypes.DATE}
})

export const Friend = sequelize.define('friend', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    userId: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: {
                tableName: 'users',
            },
            key: 'id'
        }
    },
    friendId: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: {
                tableName: 'users',
            },
            key: 'id'
        }
    }
})


User.hasMany(Post)
Post.belongsTo(User)

User.hasMany(Friend)
Friend.belongsTo(User)
