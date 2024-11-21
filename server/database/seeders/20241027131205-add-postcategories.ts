import { QueryInterface } from 'sequelize';
import { Post } from '../models/Post';
import { Category } from '../models/Category';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  const posts = await Post.findAll();
  const categories = await Category.findAll();

  await queryInterface.bulkInsert('post_categories', [
    //Algorithms
    {
      post_id: posts[0].id,
      category_id: categories[0].id,
      created_at: new Date(),
    },
    {
      post_id: posts[1].id,
      category_id: categories[0].id,
      created_at: new Date(),
    },
    {
      post_id: posts[2].id,
      category_id: categories[0].id,
      created_at: new Date(),
    },
    // Frameworks
    {
      post_id: posts[3].id,
      category_id: categories[1].id,
      created_at: new Date(),
    },
    {
      post_id: posts[4].id,
      category_id: categories[1].id,
      created_at: new Date(),
    },
    {
      post_id: posts[5].id,
      category_id: categories[1].id,
      created_at: new Date(),
    },
    // Mobile Apps
    {
      post_id: posts[6].id,
      category_id: categories[2].id,
      created_at: new Date(),
    },
    {
      post_id: posts[7].id,
      category_id: categories[2].id,
      created_at: new Date(),
    },
    {
      post_id: posts[8].id,
      category_id: categories[2].id,
      created_at: new Date(),
    },
    // Web Development
    {
      post_id: posts[9].id,
      category_id: categories[3].id,
      created_at: new Date(),
    },
    {
      post_id: posts[10].id,
      category_id: categories[3].id,
      created_at: new Date(),
    },
    {
      post_id: posts[11].id,
      category_id: categories[3].id,
      created_at: new Date(),
    },
    // Gaming
    {
      post_id: posts[12].id,
      category_id: categories[4].id,
      created_at: new Date(),
    },
    {
      post_id: posts[13].id,
      category_id: categories[4].id,
      created_at: new Date(),
    },
    {
      post_id: posts[14].id,
      category_id: categories[4].id,
      created_at: new Date(),
    },
    //Сybersecurity
    {
      post_id: posts[15].id,
      category_id: categories[5].id,
      created_at: new Date(),
    },
    {
      post_id: posts[16].id,
      category_id: categories[5].id,
      created_at: new Date(),
    },
    {
      post_id: posts[17].id,
      category_id: categories[5].id,
      created_at: new Date(),
    },
    //Artificial Intelligence
    {
      post_id: posts[18].id,
      category_id: categories[6].id,
      created_at: new Date(),
    },
    {
      post_id: posts[19].id,
      category_id: categories[6].id,
      created_at: new Date(),
    },
    {
      post_id: posts[20].id,
      category_id: categories[6].id,
      created_at: new Date(),
    },
    //Systems Programming
    {
      post_id: posts[21].id,
      category_id: categories[7].id,
      created_at: new Date(),
    },
    {
      post_id: posts[22].id,
      category_id: categories[7].id,
      created_at: new Date(),
    },
    {
      post_id: posts[23].id,
      category_id: categories[7].id,
      created_at: new Date(),
    },
    //API Development
    {
      post_id: posts[24].id,
      category_id: categories[8].id,
      created_at: new Date(),
    },
    {
      post_id: posts[25].id,
      category_id: categories[8].id,
      created_at: new Date(),
    },
    {
      post_id: posts[26].id,
      category_id: categories[8].id,
      created_at: new Date(),
    },
    //Testing
    {
      post_id: posts[27].id,
      category_id: categories[9].id,
      created_at: new Date(),
    },
    {
      post_id: posts[28].id,
      category_id: categories[9].id,
      created_at: new Date(),
    },
    {
      post_id: posts[29].id,
      category_id: categories[9].id,
      created_at: new Date(),
    },
    //DevOps
    {
      post_id: posts[30].id,
      category_id: categories[10].id,
      created_at: new Date(),
    },
    {
      post_id: posts[31].id,
      category_id: categories[10].id,
      created_at: new Date(),
    },
    {
      post_id: posts[32].id,
      category_id: categories[10].id,
      created_at: new Date(),
    },
    //Beginner Programming
    {
      post_id: posts[33].id,
      category_id: categories[11].id,
      created_at: new Date(),
    },
    {
      post_id: posts[34].id,
      category_id: categories[11].id,
      created_at: new Date(),
    },
    {
      post_id: posts[35].id,
      category_id: categories[11].id,
      created_at: new Date(),
    },
    //Operating Systems
    {
      post_id: posts[36].id,
      category_id: categories[12].id,
      created_at: new Date(),
    },
    {
      post_id: posts[37].id,
      category_id: categories[12].id,
      created_at: new Date(),
    },
    {
      post_id: posts[38].id,
      category_id: categories[12].id,
      created_at: new Date(),
    },
    //Python Programming
    {
      post_id: posts[39].id,
      category_id: categories[13].id,
      created_at: new Date(),
    },
    {
      post_id: posts[40].id,
      category_id: categories[13].id,
      created_at: new Date(),
    },
    {
      post_id: posts[41].id,
      category_id: categories[13].id,
      created_at: new Date(),
    },
    //JavaScript Programming
    {
      post_id: posts[42].id,
      category_id: categories[14].id,
      created_at: new Date(),
    },
    {
      post_id: posts[43].id,
      category_id: categories[14].id,
      created_at: new Date(),
    },
    {
      post_id: posts[44].id,
      category_id: categories[14].id,
      created_at: new Date(),
    },
    //Cross-platform Development
    {
      post_id: posts[45].id,
      category_id: categories[15].id,
      created_at: new Date(),
    },
    {
      post_id: posts[46].id,
      category_id: categories[15].id,
      created_at: new Date(),
    },
    {
      post_id: posts[47].id,
      category_id: categories[15].id,
      created_at: new Date(),
    },
    // Performance
    {
      post_id: posts[48].id,
      category_id: categories[16].id,
      created_at: new Date(),
    },
    {
      post_id: posts[49].id,
      category_id: categories[16].id,
      created_at: new Date(),
    },
    {
      post_id: posts[50].id,
      category_id: categories[16].id,
      created_at: new Date(),
    },
    //Technologies
    {
      post_id: posts[51].id,
      category_id: categories[17].id,
      created_at: new Date(),
    },
    {
      post_id: posts[52].id,
      category_id: categories[17].id,
      created_at: new Date(),
    },
    {
      post_id: posts[53].id,
      category_id: categories[17].id,
      created_at: new Date(),
    },
    //Books & Resources
    {
      post_id: posts[54].id,
      category_id: categories[18].id,
      created_at: new Date(),
    },
    {
      post_id: posts[55].id,
      category_id: categories[18].id,
      created_at: new Date(),
    },
    {
      post_id: posts[56].id,
      category_id: categories[18].id,
      created_at: new Date(),
    },
    //Entertainment
    {
      post_id: posts[57].id,
      category_id: categories[19].id,
      created_at: new Date(),
    },
    {
      post_id: posts[58].id,
      category_id: categories[19].id,
      created_at: new Date(),
    },
    {
      post_id: posts[59].id,
      category_id: categories[19].id,
      created_at: new Date(),
    },
    //Career Growth
    {
      post_id: posts[60].id,
      category_id: categories[20].id,
      created_at: new Date(),
    },
    {
      post_id: posts[61].id,
      category_id: categories[20].id,
      created_at: new Date(),
    },
    {
      post_id: posts[62].id,
      category_id: categories[20].id,
      created_at: new Date(),
    },
    // Education
    {
      post_id: posts[63].id,
      category_id: categories[21].id,
      created_at: new Date(),
    },
    {
      post_id: posts[64].id,
      category_id: categories[21].id,
      created_at: new Date(),
    },
    {
      post_id: posts[65].id,
      category_id: categories[21].id,
      created_at: new Date(),
    },
    //Hobbies
    {
      post_id: posts[66].id,
      category_id: categories[22].id,
      created_at: new Date(),
    },
    {
      post_id: posts[67].id,
      category_id: categories[22].id,
      created_at: new Date(),
    },
    {
      post_id: posts[68].id,
      category_id: categories[22].id,
      created_at: new Date(),
    },
    {
      post_id: posts[69].id,
      category_id: categories[22].id,
      created_at: new Date(),
    },
    {
      post_id: posts[70].id,
      category_id: categories[22].id,
      created_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('post_categories', {}, {});
};
