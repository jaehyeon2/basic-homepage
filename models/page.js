const Sequelize=require('sequelize');

module.exports=class Page extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type:Sequelize.STRING(50),
                allowNull:false,
            },
            mainimage:{
                type:Sequelize.STRING(300),
                allowNull:false,
            },
        },{
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName:'Page',
            tableName:'pages',
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }
}