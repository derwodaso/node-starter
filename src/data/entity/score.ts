import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Score extends BaseEntity  {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(type => User)
	@JoinColumn()
	user: User;
}