
### What is Spring Boot ?

Spring Boot is a project that is built on the top of the Spring Framework. It provides an easier and faster way to set up, configure, and run both simple and web-based applications.

It is a Spring module that provides the RAD (Rapid Application Development) feature to the Spring Framework. It is used to create a stand-alone Spring-based application that you can just run because it needs minimal Spring configuration.

![[what-is-spring-boot.png]]
### Basic Terminologies:

#### IoC (Inversion of Control)

Imagine you're used to making sandwiches by yourself. You get the bread, cheese, and other ingredients, and you assemble the sandwich. In this scenario, you are in control of the whole sandwich-making process.

Now, think of a different way, which is like IoC. Let's say you go to a sandwich shop. You order a sandwich, and the person at the shop makes it for you. You don't have to worry about getting the ingredients, preparing the sandwich, or even knowing how it's made. You've given up control of the sandwich-making process to the shop.

In software development, IoC is like going to the sandwich shop. <font color="#ffff00">Instead of your code being in control of creating and managing all the objects it needs, you let a framework or container handle it. </font>The framework is like the sandwich shop – it takes care of creating and providing the objects your code requires.

So, in simple terms, Inversion of Control means letting someone or something else take care of creating and managing objects for your program, just like going to a sandwich shop and letting them make your sandwich.

#### Dependency Injection (DI)

Let's consider you have an old TV remote control that has a built-in battery. This battery charges only through a solar system, so the remote control is highly dependent on that battery. If the battery dies, you have to open the remote control and change the battery.

Now, imagine you have a modern smart TV remote control that has a separate slot for batteries. You don't have to worry about recharging the battery. Once it dies, you can simply replace it. The remote control doesn’t care where the batteries come from, as long as they fit into the slot. You're not in control of the power source; you just inject the batteries.

In software development, Dependency Injection is similar. It's a way of providing the necessary "dependencies" (like objects, services, or data) to a program or class from the outside. Instead of the program creating these dependencies itself, they are "injected" into it.

So, in simple terms, <font color="#ffff00">Dependency Injection means giving a program or class the things it needs to work (its dependencies) from the outside, rather than it creating them internally.</font>

#### AOP (Aspect-Oriented Programming)

Think of a storybook. In a storybook, you have characters and a plot. The characters do their own things, and the plot unfolds as they go about their business. The storybook's main focus is on the characters and the plot.

Now, imagine you want to add something extra to the storybook. For example, you want to keep track of how many times a specific word is mentioned in the story, like "magic." You could go through the entire story and count every occurrence of that word, but that's a lot of work, and it might clutter the storybook.

Instead, you decide to use sticky notes. Whenever the word "magic" appears in the story, you put a sticky note there to mark it. These sticky notes don't belong to any character or the main plot; they're just there to add a little extra information without changing the story's focus.

In the context of programming, the storybook represents your application, the characters are the main components of your code, and the plot is the core logic of your program. AOP is like those sticky notes – <font color="#ffff00">i</font><font color="#ffff00">t allows you to add extra functionality or actions to your code without altering the main focus of your program.</font>

<font color="#ffff00">For example, in a real application, you might use AOP to add logging, security checks, or performance monitoring to various parts of your code without cluttering your main logic. </font>AOP lets you "decorate" your code with these additional concerns, keeping them separate from the core functionality, just like those sticky notes in the storybook.

