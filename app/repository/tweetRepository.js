import sequelize from '../config/database.js';

export class TweetRepository{
    constructor(){
        this.model = sequelize.model('Tweet');
    }

    async create(tweet){
        return this.model.create(tweet);
    }

    async findAll(){
        return this.model.findAll();
    }

    async findById(id){
        return this.model.findByPk(id);
    }

    async update(id, tweet){
        return this.model.update(tweet, {
            where: {id: id}
        });
    }

    async delete(id){
        return this.model.destroy({
            where: {id: id}
        });
    }
}