import { QueryInterface } from 'sequelize';
import { User } from '../models/User';
import { Post } from '../models/Post';
import sequelize from '../db';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  sequelize.addModels([User, Post]);

  const users = await User.findAll();

  await queryInterface.bulkInsert('posts', [
    //Algorithms
    {
      author_id: users[0].id,
      title:
        'The Power of Divide and Conquer: Why It’s So Effective in Algorithm Design',
      content:
        'Divide and conquer is a problem-solving strategy that breaks a problem into smaller subproblems, solves them independently, and combines the results. It’s a highly efficient approach used in algorithms like Merge Sort and Quick Sort. In this post, we’ll explore how divide and conquer helps reduce time complexity, the importance of recursive calls, and how to identify problems that can be solved using this method. Additionally, we will discuss its applications in areas like data processing, searching, and optimization problems.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[1].id,
      title: 'Dynamic Programming vs. Greedy Algorithms: Which Should You Use?',
      content:
        'When solving optimization problems, you often come across two powerful techniques: Dynamic Programming (DP) and Greedy Algorithms. Both are used to make decisions based on previous steps, but they differ in how they approach the problem. DP solves problems by breaking them down into simpler overlapping subproblems and storing results, while greedy algorithms make the locally optimal choice at each step, hoping to find a global optimum. In this post, we’ll compare both approaches, explore examples, and provide insights on which technique to choose depending on the problem.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[2].id,
      title:
        'A Deep Dive into Graph Algorithms: From BFS to Dijkstra’s Algorithm',
      content:
        'Graph algorithms form the backbone of many modern computer science applications, from social networks to routing systems. In this post, we’ll go through the fundamentals of graph traversal algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS), highlighting their differences and use cases. We’ll also take a closer look at Dijkstra’s algorithm for finding the shortest path in a graph with non-negative weights, understanding its significance in real-world applications such as GPS navigation and network routing.',
      publish_date: new Date(),
      status: 'active',
    },
    // Frameworks
    {
      author_id: users[3].id,
      title:
        'Why React is Still One of the Best Frameworks for Front-End Development',
      content:
        "React has been one of the most popular JavaScript libraries for building user interfaces for several years now, but many people still debate whether it's a true \"framework.\" In this post, we'll explore why React continues to dominate the front-end landscape. We'll dive into its component-based architecture, virtual DOM, and how it simplifies building interactive UIs. We'll also compare React to other popular frameworks like Angular and Vue.js, and discuss use cases where React shines and where other frameworks might be a better fit.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[4].id,
      title:
        'Exploring Django: A High-Level Python Framework for Rapid Development',
      content:
        'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. In this post, we’ll explore Django’s core features, including its built-in admin panel, ORM (Object-Relational Mapping), and security features like protection against SQL injection and cross-site scripting (XSS). We’ll discuss how Django\'s "batteries-included" philosophy makes it a great choice for developers who want to focus more on building features and less on configuring the app. If you\'re considering Django for your next project, this post will highlight its pros and cons.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[5].id,
      title: 'Vue.js vs. Angular: A Comprehensive Comparison for 2024',
      content:
        'When choosing a front-end framework, Vue.js and Angular are two of the most common options. In this post, we’ll dive into a detailed comparison of both, analyzing factors like performance, ease of learning, scalability, and community support. Vue.js is often praised for its simplicity and gentle learning curve, while Angular is known for its robustness and suitability for large enterprise applications. We’ll explore examples of when to choose Vue over Angular and vice versa, and help you decide which framework best fits your project needs in 2024.',
      publish_date: new Date(),
      status: 'inactive',
    },
    // Mobile Apps
    {
      author_id: users[6].id,
      title: 'Building Cross-Platform Mobile Apps with Flutter: Pros and Cons',
      content:
        "Flutter has gained a lot of traction as a cross-platform framework for building mobile apps. But is it really the best option for every project? In this post, we’ll explore the advantages of using Flutter for building apps that run on both iOS and Android with a single codebase. We'll look at its powerful features like hot reload, extensive widget libraries, and the Dart language. Additionally, we’ll discuss the challenges, such as app size and platform-specific issues, and when it might be better to opt for native development or other cross-platform solutions like React Native.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[7].id,
      title: 'Understanding the Basics of Mobile App UI/UX Design',
      content:
        'User Interface (UI) and User Experience (UX) design are two crucial aspects of building a successful mobile app. In this post, we’ll discuss the importance of UI/UX design and how it affects the user’s perception and interaction with your app. We’ll go over key design principles, such as simplicity, consistency, and responsiveness, and show examples of good and bad mobile app designs. Whether you’re building a mobile app for business or personal use, understanding how to create intuitive and engaging interfaces will greatly improve your app’s success.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[8].id,
      title: 'Native vs. Hybrid Mobile Apps: What’s the Best Approach in 2024?',
      content:
        "When developing a mobile app, one of the first decisions you'll face is whether to go with a native app or a hybrid solution. Native apps are built specifically for a platform (iOS or Android) and offer high performance, while hybrid apps allow developers to write code once and deploy it across both platforms. In this post, we’ll examine the differences between native and hybrid apps, including factors like performance, development time, and cost. We’ll also provide guidance on how to decide which approach best suits your project's goals in 2024.",
      publish_date: new Date(),
      status: 'active',
    },
    // Web Development
    {
      author_id: users[9].id,
      title: 'Introduction to Responsive Web Design: Best Practices for 2024',
      content:
        'Responsive web design ensures that your website looks great on all devices, from desktops to smartphones. In this post, we’ll discuss the principles of responsive design, including fluid grids, flexible images, and media queries. We’ll also cover the latest trends in responsive design for 2024, such as mobile-first design, dynamic content resizing, and CSS Grid Layout. By following these best practices, you can create websites that provide an optimal viewing experience for users on any device.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[10].id,
      title: 'The Importance of SEO in Web Development: Tips for 2024',
      content:
        'Search Engine Optimization (SEO) plays a crucial role in web development by ensuring your website ranks well in search engines like Google. In this post, we’ll explore the key elements of SEO that every web developer should understand, including proper use of HTML tags, optimizing page load speed, and building a mobile-friendly website. We’ll also discuss SEO tools and techniques that are essential for 2024, helping you improve your website’s visibility and drive more organic traffic.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[11].id,
      title: 'Web Accessibility: Ensuring Your Site is Usable for Everyone',
      content:
        'Web accessibility is about creating websites that are usable by all people, including those with disabilities. In this post, we’ll examine the importance of accessibility in web development, covering topics like alt text for images, keyboard navigation, and ensuring color contrast for readability. We’ll also explore tools and resources for testing accessibility and best practices to follow in 2024 to create inclusive web experiences. By prioritizing accessibility, you can make your website more user-friendly for a wider audience.',
      publish_date: new Date(),
      status: 'active',
    },
    // Gaming
    {
      author_id: users[12].id,
      title: 'The Evolution of Game Engines: Unity vs Unreal Engine in 2024',
      content:
        "Game engines are the backbone of modern video games, providing the tools needed to create stunning visuals and complex gameplay mechanics. In this post, we’ll compare two of the most popular game engines in 2024: Unity and Unreal Engine. We’ll discuss their strengths and weaknesses, including performance, ease of use, and the communities that support them. Whether you're building a 2D mobile game or a high-end 3D experience, understanding which engine to use can significantly impact your development process.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[13].id,
      title: 'Game Design Principles: Creating Engaging Player Experiences',
      content:
        'Good game design is about more than just graphics and sound; it’s about creating experiences that keep players engaged. In this post, we’ll dive into key game design principles, such as balance, progression, and rewards. We’ll explore how to create compelling narratives, interesting gameplay loops, and the psychology of player motivation. Whether you’re designing for a mobile game or a large-scale RPG, understanding these principles will help you craft memorable and enjoyable experiences for your audience.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[14].id,
      title: 'The Role of AI in Video Games: Enhancing NPCs and Game Worlds',
      content:
        'Artificial Intelligence (AI) is transforming the way video games are developed, particularly in how non-playable characters (NPCs) behave and interact with the player. In this post, we’ll explore the role of AI in video game development, focusing on NPC behaviors, procedural content generation, and adaptive difficulty. We’ll also look at cutting-edge AI techniques being used in 2024 to create more immersive and dynamic game worlds. From smarter enemies to interactive environments, AI is pushing the boundaries of what’s possible in gaming.',
      publish_date: new Date(),
      status: 'active',
    },
    //Сybersecurity
    {
      author_id: users[15].id,
      title: 'The Rise of Ransomware: How to Protect Your Business in 2024',
      content:
        'Ransomware attacks have become one of the most prevalent and damaging forms of cybercrime in recent years. In this post, we’ll explore the rise of ransomware, including the tactics used by cybercriminals and the impact on businesses. We’ll discuss the best practices for preventing ransomware attacks, such as regular backups, employee training, and using advanced threat detection systems. As ransomware evolves, it’s crucial to stay updated on the latest prevention strategies and response protocols to safeguard your organization in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[0].id,
      title:
        'Securing Web Applications: Common Vulnerabilities and How to Mitigate Them',
      content:
        "Web application security is critical in protecting sensitive data from attackers. In this post, we’ll cover some of the most common vulnerabilities found in web applications, such as SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF). We’ll also provide tips on how to mitigate these threats, including input validation, secure coding practices, and using security frameworks. Whether you're building a new web app or maintaining an existing one, understanding these vulnerabilities and how to secure your applications is essential in 2024.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[1].id,
      title: 'Two-Factor Authentication: Enhancing Security in the Digital Age',
      content:
        'Two-factor authentication (2FA) has become a critical layer of security in protecting user accounts and sensitive data. In this post, we’ll discuss the importance of 2FA, how it works, and the different methods of implementation, such as SMS-based codes, authentication apps, and hardware tokens. We’ll also address common challenges and misconceptions surrounding 2FA, including user resistance and potential vulnerabilities. As cyber threats continue to evolve, 2FA remains one of the most effective ways to enhance security in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    //Artificial Intelligence
    {
      author_id: users[2].id,
      title: 'The Future of AI in Healthcare: Revolutionizing Patient Care',
      content:
        'Artificial intelligence is poised to revolutionize healthcare by improving patient care, diagnostics, and treatment plans. In this post, we’ll explore how AI-powered tools are being used for medical imaging, personalized medicine, and predictive analytics. We’ll also discuss the ethical challenges of using AI in healthcare, such as data privacy and algorithmic bias. As we move further into 2024, AI’s role in healthcare is expected to expand, offering more efficient and accurate healthcare solutions for both patients and providers.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[3].id,
      title: 'Understanding Machine Learning Algorithms: A Beginner’s Guide',
      content:
        "Machine learning (ML) is a subset of artificial intelligence that enables computers to learn from data without explicit programming. In this post, we’ll break down the most common machine learning algorithms, including supervised learning, unsupervised learning, and reinforcement learning. We’ll explain how these algorithms work, their applications, and how to choose the right one for your project. If you're new to AI and ML, this guide will help you understand the foundational concepts and get started with machine learning in 2024.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[4].id,
      title:
        'AI Ethics: Navigating the Moral Implications of Artificial Intelligence',
      content:
        'As artificial intelligence continues to advance, it brings with it a host of ethical concerns that need to be addressed. In this post, we’ll explore some of the key ethical issues surrounding AI, including privacy concerns, job displacement, and the potential for bias in AI algorithms. We’ll also discuss frameworks for ethical AI development and the importance of creating transparent, accountable AI systems. As AI becomes more integrated into society in 2024, understanding and addressing these ethical implications will be essential to ensuring AI benefits everyone.',
      publish_date: new Date(),
      status: 'active',
    },
    //Systems Programming
    {
      author_id: users[5].id,
      title:
        'Understanding Memory Management in C: Pointers and Allocation Techniques',
      content:
        'Memory management is a crucial aspect of systems programming, particularly in low-level languages like C. In this post, we’ll dive into the basics of memory allocation, focusing on pointers, malloc, free, and stack vs. heap memory. We’ll also discuss common pitfalls, such as memory leaks and dangling pointers, and how to avoid them. Understanding memory management is essential for writing efficient and safe systems-level programs, especially as we move into more complex systems programming tasks in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[6].id,
      title:
        'Kernel Development: An Introduction to Writing a Simple Operating System',
      content:
        'Writing a simple operating system (OS) from scratch can be a great way to learn about the inner workings of computers. In this post, we’ll introduce you to the basics of kernel development, including setting up a bootloader, managing processes, and handling system calls. We’ll walk through the steps of building a minimal OS, and how to start interacting with hardware directly. Kernel development is a challenging but rewarding field, and in 2024, it remains a fundamental skill for systems programmers interested in low-level computing.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[7].id,
      title: 'Concurrency in Systems Programming: Techniques and Challenges',
      content:
        'Concurrency is an essential concept in systems programming, allowing multiple tasks to be executed in parallel, which is crucial for high-performance systems. In this post, we’ll explore different concurrency techniques such as multithreading, synchronization, and the challenges of race conditions and deadlocks. We’ll also look at modern tools and libraries for managing concurrency in languages like C and Rust. As systems become more complex in 2024, mastering concurrency will be a key skill for any systems programmer.',
      publish_date: new Date(),
      status: 'inactive',
    },
    //API Development
    {
      author_id: users[8].id,
      title: 'RESTful API Design: Best Practices for 2024',
      content:
        "RESTful APIs are a popular architectural style for web services, offering a scalable and flexible way to communicate between different systems. In this post, we’ll discuss the best practices for designing RESTful APIs in 2024, including proper use of HTTP methods, status codes, and versioning strategies. We’ll also cover key concepts such as statelessness, authentication, and rate limiting to ensure your API is both secure and efficient. Whether you're building a new API or improving an existing one, these practices will help you create better APIs for your applications.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[9].id,
      title: 'GraphQL vs. REST: Which API Approach Should You Choose in 2024?',
      content:
        'When building APIs, one of the most important decisions is whether to use REST or GraphQL. In this post, we’ll compare the two approaches, highlighting their strengths and weaknesses. We’ll discuss the flexibility of GraphQL in fetching data, as well as the simplicity and widespread use of RESTful APIs. Additionally, we’ll go over how to decide which approach is better for your project, based on factors like data complexity, performance, and ease of integration. As 2024 progresses, understanding both options will be key to choosing the right approach for your API.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[10].id,
      title: 'Securing Your API: Authentication and Authorization in 2024',
      content:
        'As APIs become more integral to modern applications, securing them against unauthorized access is critical. In this post, we’ll explore the different methods of securing your API, including OAuth 2.0, API keys, and JWT (JSON Web Tokens). We’ll also cover best practices for implementing authentication and authorization, including role-based access control and secure communication (e.g., HTTPS). In 2024, ensuring your API is secure is a top priority, and understanding these concepts will help you safeguard your users’ data and your system’s integrity.',
      publish_date: new Date(),
      status: 'active',
    },
    //Testing
    {
      author_id: users[11].id,
      title: 'Unit Testing in JavaScript: Best Practices for 2024',
      content:
        'Unit testing is a fundamental part of software development, ensuring that individual components work as expected. In this post, we’ll cover the basics of unit testing in JavaScript, including how to write effective tests using popular frameworks like Jest and Mocha. We’ll also discuss best practices, such as testing edge cases, avoiding testing implementation details, and maintaining test coverage. As we move into 2024, unit testing remains an essential skill for developers to write reliable and maintainable code.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[12].id,
      title:
        'End-to-End Testing: Automating Web Application Tests with Cypress',
      content:
        'End-to-end testing is crucial for verifying the full functionality of a web application. In this post, we’ll dive into Cypress, a modern testing framework that allows you to write fast, reliable end-to-end tests. We’ll cover how to set up Cypress, write test cases, and run tests on real browsers. Additionally, we’ll discuss the advantages of Cypress over traditional testing tools and its integration with continuous integration (CI) systems. As automation becomes more important in 2024, mastering end-to-end testing will ensure your web apps run smoothly in production.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[13].id,
      title:
        'Performance Testing: Tools and Techniques for Measuring Load and Scalability',
      content:
        'Performance testing is essential to ensure your application can handle heavy traffic and scale efficiently. In this post, we’ll explore popular performance testing tools such as Apache JMeter, LoadRunner, and k6. We’ll discuss how to simulate real-world traffic, measure response times, and identify bottlenecks in your system. Additionally, we’ll provide tips for optimizing performance based on test results, ensuring your application is ready for the challenges of 2024’s high-demand environments.',
      publish_date: new Date(),
      status: 'active',
    },
    //DevOps
    {
      author_id: users[14].id,
      title:
        'Continuous Integration and Continuous Deployment (CI/CD): Best Practices for 2024',
      content:
        'CI/CD pipelines have become an essential part of modern DevOps practices, enabling teams to deliver software quickly and reliably. In this post, we’ll explore best practices for implementing CI/CD in 2024, including choosing the right tools, automating build and deployment processes, and ensuring smooth integration with version control systems like Git. We’ll also discuss how to maintain a healthy CI/CD pipeline, with tips on managing test environments, reducing build times, and handling rollbacks. Mastering CI/CD will help you improve your software delivery pipeline and speed up development cycles.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[15].id,
      title:
        'Infrastructure as Code (IaC): Automating Cloud Infrastructure Management',
      content:
        'Infrastructure as Code (IaC) allows teams to manage and provision cloud infrastructure through code, making infrastructure management more efficient and repeatable. In this post, we’ll dive into the principles of IaC, focusing on popular tools like Terraform and AWS CloudFormation. We’ll cover how to define, deploy, and manage your infrastructure as code, including best practices for versioning and maintaining your infrastructure. As cloud environments grow more complex in 2024, understanding and adopting IaC will be crucial for scaling and automating your infrastructure management.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[0].id,
      title: 'Containerization with Docker: Simplifying DevOps in 2024',
      content:
        'Containerization has become a cornerstone of modern DevOps practices, enabling developers to package applications with all their dependencies into isolated containers. In this post, we’ll explore how Docker is used to create, deploy, and manage containers, and how it simplifies the process of building and shipping applications. We’ll discuss Docker best practices, including optimizing container images, managing volumes, and orchestrating containers with Kubernetes. As DevOps practices continue to evolve in 2024, containerization will play a key role in ensuring fast, scalable, and reliable application deployment.',
      publish_date: new Date(),
      status: 'active',
    },
    //Beginner Programming
    {
      author_id: users[1].id,
      title: 'Getting Started with Python: A Beginner’s Guide to Programming',
      content:
        "Python is one of the best programming languages for beginners, thanks to its simplicity and readability. In this post, we’ll introduce the basics of Python, from setting up your environment to writing your first program. We’ll cover variables, data types, loops, and functions, and provide examples to help you understand how Python works. Whether you're completely new to programming or just looking to pick up a new language, this guide will set you on the path to success in 2024.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[2].id,
      title:
        'Understanding Variables and Data Types: The Foundation of Programming',
      content:
        'Variables and data types are the building blocks of programming. In this post, we’ll break down what variables are, how to declare them, and why different data types are used in programming. We’ll also explore the most common data types like integers, strings, and booleans, along with examples in popular languages like Python and JavaScript. Mastering these concepts will give you a strong foundation as you begin your journey into programming in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[3].id,
      title: 'Learning to Code: A Step-by-Step Approach for Beginners in 2024',
      content:
        'Learning to code can feel overwhelming at first, but breaking it down into manageable steps makes it much easier. In this post, we’ll outline a step-by-step approach to becoming a programmer in 2024, from choosing the right programming language to working through beginner-friendly exercises. We’ll cover resources like free coding websites, books, and tutorials that will help you build confidence in your coding skills. With the right mindset and persistence, anyone can learn to code!',
      publish_date: new Date(),
      status: 'active',
    },
    //Operating Systems
    {
      author_id: users[4].id,
      title:
        'Understanding the Basics of Operating Systems: What Every Programmer Should Know',
      content:
        "Operating systems are the backbone of every computer, managing hardware and software resources. In this post, we’ll explore the fundamental concepts of operating systems, including processes, memory management, file systems, and security. We’ll also dive into the differences between various operating systems like Windows, Linux, and macOS, and how these systems interact with hardware. Whether you're developing applications or just curious about how your computer works, this post will provide you with a solid understanding of operating systems in 2024.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[5].id,
      title:
        'Linux vs. Windows: Which Operating System is Best for Developers in 2024?',
      content:
        "For developers, choosing the right operating system is crucial for productivity and efficiency. In this post, we’ll compare Linux and Windows, two of the most popular operating systems for development. We’ll discuss the strengths and weaknesses of each system, covering aspects such as development tools, command-line usage, performance, and compatibility with various programming languages. Whether you're just starting out or have years of experience, understanding the pros and cons of each OS will help you make an informed decision in 2024.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[6].id,
      title:
        'Virtualization and Containers: How Modern Operating Systems Enable Cloud Computing',
      content:
        'Virtualization and containers have revolutionized the way we deploy and manage applications. In this post, we’ll explore how modern operating systems enable cloud computing through virtualization technologies like virtual machines (VMs) and containers. We’ll discuss the benefits of containerization using tools like Docker and Kubernetes, and how virtualization allows multiple operating systems to run on a single physical machine. As cloud computing continues to grow in 2024, understanding these technologies will be essential for anyone working in systems programming or DevOps.',
      publish_date: new Date(),
      status: 'active',
    },
    //Python Programming
    {
      author_id: users[7].id,
      title: 'Getting Started with Python: A Beginner’s Guide to Programming',
      content:
        'Python is a versatile and beginner-friendly programming language, widely used for web development, data science, automation, and more. In this post, we’ll cover the basics of Python programming, including setting up the environment, writing your first Python script, and understanding key concepts like variables, data types, loops, and functions. Whether you’re completely new to programming or transitioning from another language, this guide will help you get started with Python in 2024.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[8].id,
      title:
        'Mastering Python Functions: A Deep Dive into Defining and Using Functions',
      content:
        'Functions are one of the core building blocks of Python programming. In this post, we’ll explore how to define and use functions in Python, including arguments, return values, and scope. We’ll also discuss advanced function topics like lambda functions, recursion, and decorators. By the end of this post, you’ll have a strong understanding of how to write efficient, reusable code in Python, which is essential for building more complex projects in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[9].id,
      title:
        'Python for Data Science: Using Pandas and NumPy for Data Analysis',
      content:
        'Python has become one of the most popular languages for data science, thanks to powerful libraries like Pandas and NumPy. In this post, we’ll walk through the basics of using Pandas for data manipulation and NumPy for numerical computations. We’ll cover how to load datasets, clean data, perform exploratory data analysis, and visualize results. Whether you’re analyzing business data, scientific data, or just starting with Python for data science, this post will help you harness the power of these libraries in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    //JavaScript Programming
    {
      author_id: users[10].id,
      title: 'Introduction to JavaScript: A Beginner’s Guide to Programming',
      content:
        'JavaScript is one of the most widely used programming languages today, powering everything from websites to mobile apps. In this post, we’ll walk through the basics of JavaScript, including variables, data types, operators, and control flow structures like loops and conditionals. Whether you’re building dynamic web pages or working with Node.js on the server side, mastering JavaScript is essential for modern developers in 2024. This guide will help you get started with JavaScript and understand the fundamentals behind this powerful language.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[11].id,
      title: 'Asynchronous JavaScript: Mastering Promises and Async/Await',
      content:
        "Handling asynchronous operations is one of the core challenges in JavaScript. In this post, we’ll dive into how JavaScript handles asynchronous behavior using callbacks, promises, and async/await syntax. We’ll explain the concept of asynchronous code execution, how promises work, and how async/await simplifies working with asynchronous code. By the end of this post, you'll have a deep understanding of how to manage async operations in JavaScript, which is crucial for modern web applications in 2024.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[12].id,
      title: 'JavaScript ES6 Features You Should Know in 2024',
      content:
        "JavaScript has evolved significantly with the introduction of ES6 (ECMAScript 2015) and newer features. In this post, we’ll cover some of the most important ES6 features you should be familiar with in 2024, such as arrow functions, template literals, destructuring, and modules. We’ll also discuss how these features improve code readability and maintainability. Whether you're working on front-end or back-end JavaScript, knowing these features will help you write cleaner, more efficient code.",
      publish_date: new Date(),
      status: 'inactive',
    },
    //Cross-platform Development
    {
      author_id: users[13].id,
      title:
        'The Future of Cross-Platform Development: Why It’s Essential in 2024',
      content:
        'Cross-platform development allows developers to write code once and deploy it across multiple platforms, saving both time and resources. In this post, we’ll explore the importance of cross-platform development in 2024, including popular frameworks like React Native, Flutter, and Xamarin. We’ll discuss the benefits, such as code reusability and faster development cycles, and the challenges, such as platform-specific limitations. If you’re looking to build apps for multiple platforms, understanding the future trends in cross-platform development will be key to your success.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[14].id,
      title:
        'React Native vs. Flutter: Which Cross-Platform Framework Should You Choose?',
      content:
        "React Native and Flutter are two of the most popular frameworks for cross-platform mobile app development. In this post, we’ll compare these two frameworks in terms of performance, development experience, community support, and ease of use. We’ll also provide insights into when to choose one over the other, based on project requirements and your team's expertise. Whether you’re just starting with mobile app development or looking to switch frameworks, this comparison will help you make an informed decision in 2024.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[15].id,
      title:
        'Building Cross-Platform Desktop Apps with Electron: A Complete Guide',
      content:
        'Electron is a popular framework for building cross-platform desktop applications using web technologies like HTML, CSS, and JavaScript. In this post, we’ll walk through the process of building a desktop app with Electron, from setting up the development environment to packaging and distributing the app. We’ll also discuss performance optimizations and best practices for creating native-like experiences on Windows, macOS, and Linux. If you’re looking to expand your web development skills into desktop app development, this guide will help you get started in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    // Performance
    {
      author_id: users[0].id,
      title: 'Optimizing Web Performance: Key Strategies for 2024',
      content:
        'Web performance is crucial for user experience and SEO rankings. In this post, we’ll explore key strategies for optimizing your website’s performance in 2024. From lazy loading and code splitting to server-side rendering (SSR) and image compression, we’ll cover techniques that can significantly improve page load times. Whether you’re a front-end developer or a back-end engineer, understanding how to optimize performance at every level of your stack is essential for building fast, responsive websites.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[1].id,
      title: 'Improving Mobile App Performance: Best Practices for 2024',
      content:
        'Mobile app performance is critical to user retention and satisfaction. In this post, we’ll share the best practices for optimizing mobile app performance in 2024. We’ll cover techniques like reducing app size, optimizing images, minimizing network requests, and implementing background processing. Whether you’re working with native Android/iOS apps or cross-platform frameworks like React Native and Flutter, these performance tips will help ensure your app runs smoothly across a variety of devices.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[2].id,
      title: 'Database Performance Optimization: Techniques for Faster Queries',
      content:
        'Databases are at the heart of most applications, and their performance can significantly impact overall app speed. In this post, we’ll discuss several techniques for optimizing database performance in 2024, including query optimization, indexing strategies, caching, and database partitioning. We’ll also explore how to identify slow queries using database profiling tools and optimize them for faster execution. Whether you’re using MySQL, PostgreSQL, or NoSQL databases, these tips will help ensure that your database scales efficiently with your application’s growing demands.',
      publish_date: new Date(),
      status: 'inactive',
    },
    //Technologies
    {
      author_id: users[3].id,
      title: 'Emerging Technologies in 2024: What You Need to Know',
      content:
        "2024 is shaping up to be a year of rapid advancements in technology. In this post, we’ll explore the emerging technologies that are set to disrupt various industries, from AI and quantum computing to blockchain and edge computing. We’ll discuss how these technologies are transforming businesses and what skills developers will need to stay ahead of the curve. Whether you're looking to specialize in a new technology or simply understand the trends, this post will give you insights into the future of tech.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[4].id,
      title:
        'Blockchain Beyond Cryptocurrency: Exploring Its Real-World Applications',
      content:
        'Blockchain technology has far-reaching potential beyond its use in cryptocurrency. In this post, we’ll take a look at how blockchain is being applied in sectors like supply chain management, healthcare, and digital identity verification. We’ll dive into the fundamentals of blockchain, the challenges of implementation, and how it is solving real-world problems. Understanding blockchain’s applications in 2024 is key for developers looking to work on innovative, decentralized solutions.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[5].id,
      title: 'The Rise of 5G Technology and Its Impact on Development',
      content:
        '5G technology is poised to revolutionize how we connect and interact with the world around us. In this post, we’ll explore how 5G networks are transforming mobile and IoT development, offering ultra-fast speeds and low latency. We’ll discuss the opportunities and challenges 5G presents for developers, including its potential to enable new applications in augmented reality, autonomous vehicles, and smart cities. If you’re interested in the future of mobile development, understanding 5G is essential for staying ahead of the competition in 2024.',
      publish_date: new Date(),
      status: 'active',
    },
    //Books & Resources
    {
      author_id: users[6].id,
      title: 'Top 5 Programming Books You Should Read in 2024',
      content:
        "In 2024, the tech industry continues to evolve, and staying updated with the latest trends and best practices is crucial. In this post, we’ll review five must-read programming books that every developer should have on their bookshelf. From mastering algorithms and data structures to improving your coding workflow, these books provide valuable insights for developers at all levels. Whether you're just starting out or a seasoned professional, these resources will help you refine your skills and stay ahead in the fast-paced world of software development.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[7].id,
      title: 'The Best Online Resources for Learning Web Development in 2024',
      content:
        'The web development landscape is constantly changing, and keeping up with the latest tools, frameworks, and best practices is essential for developers. In this post, we’ll share the best online resources for learning web development in 2024. We’ll highlight websites, courses, and tutorials that cover front-end, back-end, and full-stack development. Whether you’re just getting started or looking to deepen your expertise, these resources will help you stay up-to-date and sharpen your web development skills.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[8].id,
      title: 'Essential Books for Mastering Data Science in 2024',
      content:
        "Data science is one of the most in-demand fields in tech, and the right resources can help you master the skills needed to succeed. In this post, we’ll review the essential books for learning data science in 2024, covering topics like statistics, machine learning, and data visualization. Whether you're a beginner or looking to refine your skills, these books will help you build a solid foundation in data science and keep you on the cutting edge of this exciting field.",
      publish_date: new Date(),
      status: 'active',
    },
    //Entertainment
    {
      author_id: users[9].id,
      title: 'The Evolution of Video Game Graphics: From Pixels to Realism',
      content:
        "Video game graphics have come a long way since the days of pixelated sprites and 8-bit colors. In this post, we’ll explore the evolution of video game graphics, from early arcade games to the hyper-realistic graphics of modern titles. We’ll discuss the technologies that have driven this transformation, such as ray tracing, motion capture, and AI-powered rendering. Whether you're a gamer or a developer, understanding the history of game graphics will give you a deeper appreciation of the art and technology behind your favorite games.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[10].id,
      title:
        'The Rise of Streaming Services: How They Changed Entertainment in 2024',
      content:
        "Streaming services like Netflix, Disney+, and Amazon Prime Video have transformed the entertainment industry in recent years. In this post, we’ll dive into how streaming services have evolved in 2024, focusing on their impact on traditional TV and film production, audience behavior, and content consumption. We’ll explore the rise of original content, the competition between platforms, and how streaming has changed how we watch TV. If you're interested in the entertainment industry, this post will give you insights into the current streaming landscape.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[11].id,
      title: 'The Impact of Social Media on Modern Entertainment Culture',
      content:
        "Social media platforms like YouTube, TikTok, and Instagram have reshaped the entertainment industry in profound ways. In this post, we’ll examine how social media has influenced modern entertainment, from viral trends and influencer culture to the rise of user-generated content. We’ll explore how celebrities and creators leverage social media to connect with audiences and promote their work, as well as the challenges of maintaining authenticity in the digital age. If you're interested in entertainment culture and its evolving relationship with social media, this post is for you.",
      publish_date: new Date(),
      status: 'active',
    },
    //Career Growth
    {
      author_id: users[12].id,
      title: 'How to Build a Successful Career in Tech in 2024',
      content:
        'The tech industry continues to grow rapidly, offering exciting career opportunities for developers, designers, and engineers. In this post, we’ll discuss the steps to building a successful career in tech in 2024. From choosing the right skills and certifications to networking and finding the best opportunities, we’ll cover the key factors that can help you advance in the tech field. Whether you’re just starting your career or looking to take the next step, these tips will set you on the path to success.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[13].id,
      title: 'The Importance of Networking for Career Advancement in 2024',
      content:
        'Networking plays a crucial role in career growth, especially in fields like tech and business. In this post, we’ll explore why networking is essential for career advancement in 2024. We’ll discuss the different ways you can build and maintain valuable professional relationships, both online and offline, including attending industry events, joining online communities, and leveraging social media. Learn how to network effectively and how it can help you open doors to new opportunities and career growth.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[14].id,
      title: 'How to Stand Out in a Competitive Job Market in 2024',
      content:
        "In today’s competitive job market, it’s important to differentiate yourself from other candidates. In this post, we’ll share strategies for standing out when applying for jobs in 2024. From personal branding and optimizing your resume to leveraging LinkedIn and preparing for interviews, we’ll cover actionable tips that will help you make a lasting impression. Whether you're a seasoned professional or entering the job market for the first time, this post will provide you with valuable insights for career success.",
      publish_date: new Date(),
      status: 'active',
    },
    // Education
    {
      author_id: users[15].id,
      title: 'The Future of Online Learning: Trends to Watch in 2024',
      content:
        'Online education has been growing rapidly, and 2024 is shaping up to be a pivotal year for e-learning. In this post, we’ll explore the trends that will define the future of online learning, from personalized learning experiences and AI-driven courses to the rise of micro-credentials and virtual classrooms. We’ll also look at how online education is transforming traditional learning environments and providing students with new opportunities to learn at their own pace. Whether you’re a student, teacher, or lifelong learner, this post will give you insights into what to expect in the coming years.',
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[0].id,
      title: 'How to Make the Most of Your Online Courses in 2024',
      content:
        "Online courses offer a flexible and convenient way to gain new skills and knowledge. However, to get the most out of them, it’s important to approach online learning strategically. In this post, we’ll share tips on how to make the most of your online courses in 2024. From setting clear learning goals and managing your time effectively to engaging with peers and instructors, we’ll cover strategies that will help you succeed in the virtual classroom. Whether you're taking a course to advance your career or learn a new hobby, these tips will ensure you maximize your learning experience.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[1].id,
      title: 'The Benefits of Lifelong Learning in the Modern Job Market',
      content:
        "In today’s rapidly evolving job market, the importance of lifelong learning cannot be overstated. In this post, we’ll explore the benefits of continuous learning, both for career development and personal growth. We’ll discuss how acquiring new skills, staying up-to-date with industry trends, and embracing new technologies can help you stay competitive and adaptable in your career. If you're looking to future-proof your career and ensure long-term success, lifelong learning is key. This post will provide you with practical advice on how to incorporate continuous learning into your daily routine.",
      publish_date: new Date(),
      status: 'active',
    },
    //Hobbies
    {
      author_id: users[2].id,
      title: 'How to Start a DIY Project: Tips for Beginners',
      content:
        "Starting a DIY project can be a rewarding and creative way to spend your time. Whether you're building furniture, crafting decorations, or working on home improvements, there are endless possibilities for personal projects. In this post, we’ll guide you through the basics of starting a DIY project, from choosing the right materials to planning your steps. We’ll also provide tips on how to stay motivated and troubleshoot common challenges. If you’re a beginner looking to dive into the world of DIY, this post will help you get started with confidence.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[3].id,
      title: 'Exploring the World of Collecting: How to Get Started',
      content:
        'Collecting is a fun and rewarding hobby that allows you to explore new interests and discover unique items. Whether you’re interested in stamps, coins, action figures, or vintage toys, collecting can provide a sense of purpose and excitement. In this post, we’ll introduce you to the world of collecting and share tips on how to get started. We’ll cover how to identify valuable items, where to find them, and how to care for your collection. Whether you’re looking to start a new collection or expand an existing one, this post will provide helpful advice to guide you along the way.',
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[4].id,
      title: 'The Art of Photography: Tips for Capturing Stunning Photos',
      content:
        "Photography is more than just taking pictures—it’s about capturing moments, telling stories, and expressing creativity. Whether you’re using a smartphone or a professional camera, anyone can take stunning photos with the right techniques. In this post, we’ll share essential photography tips that will help you improve your skills. From understanding lighting and composition to mastering manual settings, we’ll cover key concepts that can elevate your photos. If you're passionate about photography and want to take your hobby to the next level, this post will provide you with the tools you need to succeed.",
      publish_date: new Date(),
      status: 'inactive',
    },
    {
      author_id: users[5].id,
      title: 'Gardening for Beginners: How to Start Your Own Garden',
      content:
        "Gardening is a relaxing and rewarding hobby that allows you to connect with nature and create a beautiful outdoor space. Whether you have a small balcony or a large backyard, starting a garden is easier than you might think. In this post, we’ll guide you through the basics of gardening, from choosing the right plants for your environment to preparing the soil and maintaining your garden. We’ll also share tips on how to care for your plants and avoid common mistakes. If you're looking to start your own garden and bring some greenery into your life, this post will give you the knowledge you need to get started.",
      publish_date: new Date(),
      status: 'active',
    },
    {
      author_id: users[6].id,
      title: 'Cooking as a Hobby: Easy Recipes to Try at Home',
      content:
        "Cooking is not only a valuable skill but also a creative and fulfilling hobby that can bring joy to your life. Whether you're a beginner or an experienced cook, trying new recipes and experimenting in the kitchen can be an exciting way to spend your time. In this post, we’ll share some easy and delicious recipes that you can try at home, from quick weeknight dinners to indulgent desserts. We’ll also provide tips on how to improve your cooking skills and make the most of your time in the kitchen. If you’ve always wanted to explore cooking as a hobby, this post will inspire you to get started.",
      publish_date: new Date(),
      status: 'active',
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('posts', {}, {});
};
