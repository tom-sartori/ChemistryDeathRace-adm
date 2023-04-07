export class Question {
  id!: string;
  name!: string;
  category!: string;
  difficulty!: string;
  propositions!: [
    {
      name: string;
      answer: boolean;
      image?: string;
    }
  ];
  image?: string;
}
