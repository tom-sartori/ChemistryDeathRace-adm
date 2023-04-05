export class Question {
  id!: string;
  name!: string;
  category!: string;
  propositions!: [
    {
      name: string;
      answer: boolean;
      image?: string;
    }
  ];
  image?: string;
}
