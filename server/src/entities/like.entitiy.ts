import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Murmur } from "./murmur.entity";
import { User } from "./user.entity";

@Entity("likes")
@Unique(["userId", "murmurId"])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "murmurId" })
  murmur: Murmur;

  @Column()
  murmurId: number;

  @CreateDateColumn()
  createdAt: Date;
}
