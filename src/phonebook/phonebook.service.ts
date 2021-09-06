import { Injectable } from '@nestjs/common';
import { NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Phonebook } from './phonebook-model-shema';

@Injectable()
export class PhonebookService {

	constructor(@InjectModel('Phonebook') private readonly __phonebookModel: Model<Phonebook> ){}

	async addNewPhonebookToTheDatabase(phonebook: any)
	{

		const book = new this.__phonebookModel(phonebook);
		return await book.save();
	}



	async getAllPhonebooksFromTheDatabase()
	{
		const book = await this.__phonebookModel.find().exec();
        return book.map(data => 
        ({
            id: data.id,
            phone: data.phone,
            name: data.name,
         
        }));
	}

	async getOnePhonebookFromTheDatabase(phonebookId: string)
	{
		const book = await this.__phonebookModel.findById(phonebookId);
		return book;
	}

	async updateOnePhonebookFromTheDatabase(phonebookId: string, phonebook: any)
	{
		const boook = await this.findBook(phonebookId);

				 if(phonebook.name)
				 {
					 boook.name = phonebook.name;
				 }
				 if(phonebook.phone)
				 {
					 boook.phone = phonebook.phone;
				 }
		
				 boook.save();
			
	}


	private async findBook(id: string): Promise<Phonebook>
	{
		let book;

		try
		{
		book = await this.__phonebookModel.findById(id).exec();

		}
		catch(error)
		{
			throw new NotFoundException('could not find books of ID ' + id );
		}

		if(!book)
		{
			throw new NotFoundException('could not find books of ID ' + id );
		}
		return book;

	}

	async deleteOnePhonebookFromTheDatabase(phonebookId: string)
	{
		const book = await this.__phonebookModel.deleteOne({_id: phonebookId}).exec();
		return book;
	}

	searchPhonebookByNameOrNumber(options: any)
	{
		return this.__phonebookModel.find(options).exec();
	}
}
