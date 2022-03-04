const { DATE } = require('sequelize');
const Sequelize=require('sequelize');

module.exports=class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type:Sequelize.STRING(40),
                allowNull:false,
            },
            image:{
                type:Sequelize.STRING(300),
                allowNull:true,
            },
            content:{
                type:Sequelize.STRING(500),
                allowNull:false,
            },
            writer:{
                type:Sequelize.STRING(40),
                allowNull:false,
            },
            type:{
                type:Sequelize.STRING(10),
                allowNull:false,
            },
            views:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
            },
            date:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            isdelete:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
            },
            boardid:{
                type:Sequelize.INTEGER,
                allowNull:false,
            }
        },{
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName:'Post',
            tableName:'posts',
			charset:'utf8mb4',
			collate:'utf8mb4_general_ci',
        })
    }
}