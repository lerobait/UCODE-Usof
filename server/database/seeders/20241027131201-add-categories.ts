import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkInsert('categories', [
    {
      title: 'Algorithms',
      description:
        'Topics related to database design, queries, optimization, and administration.',
      created_at: new Date(),
    },
    {
      title: 'Frameworks',
      description:
        'Everything about popular frameworks for various programming languages.',
      created_at: new Date(),
    },
    {
      title: 'Mobile Apps',
      description:
        'Development of apps for iOS and Android. Tips, best practices, and tools.',
      created_at: new Date(),
    },
    {
      title: 'Web Development',
      description:
        'Programming for creating websites and web applications. Technologies, tools, and best practices.',
      created_at: new Date(),
    },
    {
      title: 'Gaming',
      description:
        'Video game development: from mechanics to graphics, optimization, and production processes.',
      created_at: new Date(),
    },
    {
      title: 'Cybersecurity',
      description:
        'Information security, vulnerability testing, and app protection.',
      created_at: new Date(),
    },
    {
      title: 'Artificial Intelligence',
      description:
        'Machine learning, neural networks, data processing, and building intelligent systems.',
      created_at: new Date(),
    },
    {
      title: 'Systems Programming',
      description:
        'Writing system utilities, working with operating systems, and low-level programming.',
      created_at: new Date(),
    },
    {
      title: 'API Development',
      description:
        'Creating and integrating APIs, design tips, and security best practices.',
      created_at: new Date(),
    },
    {
      title: 'Testing',
      description:
        'Software testing, test automation, strategies, and methodologies.',
      created_at: new Date(),
    },
    {
      title: 'DevOps',
      description:
        'Tools and practices that ensure rapid and stable development, deployment, and monitoring.',
      created_at: new Date(),
    },
    {
      title: 'Beginner Programming',
      description:
        'Tips and resources for those just starting their programming journey.',
      created_at: new Date(),
    },
    {
      title: 'Operating Systems',
      description:
        'Programming for operating systems, drivers, kernels, and working with system components.',
      created_at: new Date(),
    },
    {
      title: 'Python Programming',
      description:
        'Discussions on Python language: libraries, frameworks, and best practices.',
      created_at: new Date(),
    },
    {
      title: 'JavaScript Programming',
      description:
        'All about JS: frontend, backend, libraries, frameworks, and current trends.',
      created_at: new Date(),
    },
    {
      title: 'Cross-platform Development',
      description:
        'Using tools to create applications that work on multiple platforms.',
      created_at: new Date(),
    },
    {
      title: 'Performance',
      description:
        'Topics about improving app performance, code optimization, and architectural decisions.',
      created_at: new Date(),
    },
    {
      title: 'Technologies',
      description:
        'Discussions on emerging and cutting-edge technologies, such as quantum computing and blockchain.',
      created_at: new Date(),
    },
    {
      title: 'Books & Resources',
      description:
        'Recommendations for books and online resources for developers.',
      created_at: new Date(),
    },
    {
      title: 'Entertainment',
      description:
        'Topics related to movies, TV shows, video games, and other forms of entertainment.',
      created_at: new Date(),
    },
    {
      title: 'Career Growth',
      description:
        'Tips on career development for developers, career switching, and personal effectiveness.',
      created_at: new Date(),
    },
    {
      title: 'Education',
      description:
        'Discussions on educational programs, courses, learning materials, and approaches.',
      created_at: new Date(),
    },
    {
      title: 'Hobbies',
      description:
        'A place to talk about personal hobbies outside of work and programming.',
      created_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('categories', {}, {});
};
