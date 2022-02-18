const Sequelize= require("sequelize");

module.exports=class extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type:Sequelize.STRING(40),
                allowNull:false,
            },
            nick:{
                type:Sequelize.STRING(50),
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(200),
                allowull:false,
            },
            auth:{
                type:Sequelize.STRING(10),
                allowNull:false,
            }
        },{
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName:'User',
            tableName:'users',
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }
}