const Sequelize=require('sequelize');

module.exports=class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type:Sequelize.STRING(40),
                allowNull:false,
            },
            type:{
                type:Sequelize.STRING(10),
                allowNull:false,
            }
        },{
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName:'Board',
            tableName:'Board',
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
};