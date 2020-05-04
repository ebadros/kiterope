# Kiterope

<strong>Description</strong>

Kiterope is a web application originally designed to function as a coaching application. Coaches could create programs with multiple steps that clients could subscribe to and receive scheduled tasks for them to complete. Completing a task requires either acknowledgement of completion through a click, or the input of some sort of feedback, e.g. number of pushups completed. Kiterope would then allow the user to see his progress vs other people on the same plan. It also would allow the coach to modify the plan for the user based on his progress.

In this way, Kiterope functions as a next-generation, distributed to-do list - one that can be shared for groups of tasks that have multiple steps, need to be scheduled, have multimedia components, or have dependent/precedent logic. I can envision it being used by coaches, or school systems to plan an entire semester and then send out all of the tasks on a schedule that can then be quickly updated for the next semester. I can also see it being used for people to communicate how to do things because it allowed for different flows based on the feedback.

<strong>Details</strong>

The application uses Django/Python for the backend and then React for the frontend and was deployed on AWS Elastic Beanstalk. Feel free to use what you want.

<strong>What I Learned</strong>
Even though I knew that I should create and MVP and get some actual users first, I proceeeded building this app out without doing so. It's a great example of a project with huge feature creep. I kept adding features, so much that the whole project became unwieldy at the time. I also don't think it benefited me that I used PostgreSQL and Django on the backend. At the time, I was more comfortable with Django than with a NoSQL variant and I spent a lot of time making things realtime. Right now, I'd probably use my AppFactory builder that builds on Firebase. 




