# Apollo
## Semester Calendar 
The project involves implementing a tool (scheduler) that helps schedule and organize MathCS classes. This scheduler should reflect different class meeting patterns (MW, MWF, TuTh, Fri only) and it should be very user-friendly, via an easy to interact with interface. Classes should be shown via a calendar-like layout. Each class should be created into a unique movable box directly on the calendar (drag and drop). The ideal software would feature a robust, fast, and elegant GUI.


Demo on an Amazon Ubuntu EC2 instance: http://52.11.161.241:3000/

### Getting Started
1. [Download MongoDB] (https://docs.mongodb.org/manual/installation/)
2. [Download Node]  (https://nodejs.org/en/download/)
3. Clone the repository 
4. ```npm install bower -g``` in the root directory
5.  ```npm install``` in the root directory
6.  ```bower install``` in the public directory 
7. ```npm start``` in the root directory to serve the code to localhost:3000

### Future Development

- Drag and Drop
- Optimized saving mechanisms (not deleting then creating, use update instead)
- Add login page
- Add security for APIs
- Separate data into semesters so db does not need to be reset every semester
- Accomodations for labs and other unstructured schedule times
- Add autocomplete to calendar
- Implement JS Minification to optimize
- Calendar validations
- Allow reordering of classrooms
- Consistency with x-editable (change to simple input)
- View by time patterns than simple days
