import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Score } from "./score";

@Entity()
export class User extends BaseEntity  {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	hash: string;

	@OneToMany(type => Score, score => score.user)
	scores: Score[];
}