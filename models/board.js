const Sequelize=require('sequelize');

module.exports=class Post extends Sequelize.Model{
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
            modelName:'Post',
            tableName:'posts',
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }
}