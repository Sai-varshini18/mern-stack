import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})17 Form Validations In React

Form Validations in React:

Form validation is the process of checking whether the user-entered data is correct, complete,
and acceptable before submitting the form.
Validation helps to:
• Prevent empty fields
• Ensure correct data format
• Improve security
• Improve user experience
• Prevent invalid data from entering the database
Real-Life Examples of Validation
Application Validation
Gmail Login Checks correct email & password
Instagram Signup Password length validation
Banking App OTP validation
College Form Roll number validation
Types of Form Validation
1. Client-Side Validation
Validation done in the browser before sending data to the server.
Examples:
• Required field validation
• Email format validation
• Password length validation
2. Server-Side Validation
Validation done in backend/server/database.
Examples:
• Duplicate email checking
• Login credential checking

Form Validation Flow in React:
User enters data
↓
Input event occurs
↓
React state updates
↓
User clicks submit
↓
Validation checks run
↓
If valid → Submit form
If invalid → Show error messages
React Concepts Used in Form Validation
Concept Purpose
useState() Store form data
onChange Handle input changes
onSubmit Handle form submission
preventDefault() Prevent page refresh
Conditional Rendering Show errors
1. Form State in React
React stores form data using useState().
Example
const [form, setForm] = useState({
name: "",
email: "",
});
Explanation
• form stores input values
• setForm() updates values
• Initial values are empty
Output
Initially:
Name: ""

Email: ""
After typing:
Name: Surya
Email: surya@gmail.com
3.Input Events in React
Input events are actions performed by the user on input fields.
Common input events:
Event Purpose
onChange Detect typing
onFocus Detect focus
onBlur Detect leaving input
onSubmit Detect form submission
onChange Event
Triggered whenever user types.
Example:
<input
type="text"
onChange={handleChange}
/>
Example Function:
function handleChange(e) {
console.log(e.target.value);
}
Output:
If user types:
Surya
Console Output:
S
Su
Sur
Sury
Surya

3. Form Handling in React:
Form handling means:
• Reading form data
• Validating form data
• Submitting form data
Example:
<form onSubmit={handleSubmit}>
Submit Function

function handleSubmit(e) {
e.preventDefault();

console.log(form);
}
Why We Use preventDefault()
Normally forms refresh the page after submit.
e.preventDefault();
prevents page reload.
Output Without preventDefault()
Page refreshes
Data disappears
Output With preventDefault()
Page does not refresh
React handles form properly
4. Required Field Validation
Checks whether input field is empty.
Example

if (form.name === "") {
alert("Name is required");
}
Output
If field empty:
Alert: Name is required

5. Email Validation:
Checks whether email format is correct.
Example
if (!form.email.includes("@")) {
alert("Invalid Email");
}
Correct Email
surya@gmail.com
Wrong Email
suryagmail.com
Output
Alert: Invalid Email
6. Password Validation
Checks password length.
Example
if (form.password.length < 6) {
alert("Password too short");
}
Output
Password:
123
Output:
Alert: Password too short
7. Confirm Password Validation
Checks whether both passwords match.
Example

if (
form.password !==
form.confirmPassword
) {
alert("Passwords do not match");
}
Output
Password: 123456
Confirm Password: 12345
Output:
Alert: Passwords do not match

8. Number Validation
Checks whether input contains only numbers.
Example
if (isNaN(form.phone)) {
alert("Only numbers allowed");
}
Output
Input:
abc123
Output:
Alert: Only numbers allowed
9. Length Validation
Checks minimum or maximum characters.
Example
if (form.username.length < 3) {
alert("Minimum 3 characters");
}
Output
Input:
ab
Output:
Alert: Minimum 3 characters

10. Dynamic Input Handling
React usually uses one function for all inputs.
Example
function handleChange(e) {
const { name, value } =
e.target;
setForm({
...form,
[name]: value,
});
}

Explanation:
Part Meaning
name Input field name
value Current value
...form Copy old data
[name]: value Update specific field

Example Input
<input
name="email"
onChange={handleChange}
/>
Output
If user types:
surya@gmail.com
State becomes:
{
email: "surya@gmail.com"
}

11. Error Handling Using State
React stores errors in a separate state.
Example
const [errors, setErrors] =
useState({});
Error Object Example
{
email: "Invalid Email",
password: "Password too short"
}

Displaying Errors
{
errors.email && (
<p>{errors.email}</p>
)
}
Output
Invalid Email
shown below input field
12. Real-Time Validation
Validation while typing.
Example
<input
onChange={handleChange}
/>
As user types:
abc
Error instantly shows:
Email is invalid
Advantages of Form Validation

Advantage Explanation
Data Accuracy Correct user data
Security Prevent harmful input
Better UX Instant feedback
Prevent Errors Cleaner database
Better Performance Avoid invalid requests

Mini Project for Form Validation

import React, { useState, useEffect } from "react";
/* ---------------- LOCAL STORAGE KEYS ---------------- */
const STUDENTS_KEY = "students";
const SESSION_KEY = "student_session";
/* ---------------- LOCAL STORAGE FUNCTIONS ---------------- */
function getStudents() {
return JSON.parse(
localStorage.getItem(STUDENTS_KEY)
) || [];
}

function saveStudents(students) {
localStorage.setItem(
STUDENTS_KEY,
JSON.stringify(students)
);
}
function saveSession(student) {
localStorage.setItem(
SESSION_KEY,
JSON.stringify(student)
);
}

function getSession() {
return JSON.parse(
localStorage.getItem(SESSION_KEY)
);
}

function clearSession() {
localStorage.removeItem(SESSION_KEY);
}

/* ================= SIGNUP PAGE ================= */

function Signup({ setPage }) {
const [form, setForm] = useState({
name: "",
roll: "",
course: "",
email: "",
password: "",
});

/* INPUT EVENTS */
function handleChange(event) {
const { name, value } = event.target;

setForm({

...form,
[name]: value,
});
}

/* FORM HANDLING */
function handleSubmit(event) {
event.preventDefault();

const students =
getStudents();

const studentExists =
students.find(
(student) =>
student.email === form.email
);

if (studentExists) {
alert(
"Student already registered"
);
return;
}

const newStudent = {
id: Date.now(),
name: form.name,
roll: form.roll,
course: form.course,
email: form.email,

password: form.password,
};

saveStudents([
...students,
newStudent,
]);

alert(
"Signup Successful"
);

setForm({
name: "",
roll: "",
course: "",
email: "",
password: "",
});

setPage("login");
}

return (

<div className="container">
<div className="box">

<h1>Student Signup</h1>

<form onSubmit={handleSubmit}>

<input
type="text"
name="name"
placeholder="Enter Name"
value={form.name}
onChange={handleChange}
required
/>

<input
type="text"
name="roll"
placeholder="Enter Roll Number"
value={form.roll}

onChange={handleChange}
required

/>

<input
type=”text”
name=”course”
placeholder=”Enter Course”
value={form.course}
onChange={handleChange}
required
/>

<input
type=”email”
name=”email”
placeholder=”Enter Email”
value={form.email}
onChange={handleChange}
required
/>

<input
type=”password”
name=”password”

placeholder="Enter Password"
value={form.password}
onChange={handleChange}
required
/>

<button type="submit">
Signup
</button>
</form>

<p>
Already have account?{" "}
<span
onClick={() =>
setPage("login")
}
>
Login
</span>
</p>
</div>
</div>
);

}

/* ================= LOGIN PAGE ================= */
function Login({
setPage,
setStudent,
}) {
const [form, setForm] = useState({
email: "",
password: "",
});

/* INPUT EVENTS */
function handleChange(event) {
const { name, value } =
event.target;

setForm({
...form,
[name]: value,
});
}

/* FORM HANDLING */

function handleSubmit(event) {
event.preventDefault();

const students =
getStudents();

const foundStudent =
students.find(
(student) =>
student.email === form.email &&
student.password ===
form.password
);

if (!foundStudent) {
alert(
"Invalid Email or Password"
);
return;
}

saveSession(foundStudent);

setStudent(foundStudent);

alert(
"Login Successful"
);

setForm({
email: "",
password: "",
});

setPage("dashboard");
}

return (
<div className="container">
<div className="box">

<h1>Student Login</h1>

<form onSubmit={handleSubmit}>

<input
type="email"

name="email"
placeholder="Enter Email"
value={form.email}
onChange={handleChange}
required
/>

<input
type="password"
name="password"
placeholder="Enter Password"
value={form.password}
onChange={handleChange}
required
/>

<button type="submit">
Login
</button>

</form>

<p>

Don't have account?{" "}
<span
onClick={() =>
setPage("signup")
}
>
Signup
</span>
</p>

</div>
</div>
);
}

/* ================= DASHBOARD ================= */
function Dashboard({
student,
logout,
}) {
return (
<div className="container">
<div className="box">

<h1>Student Dashboard</h1>

<h2>
Welcome {student.name}
</h2>

<p>
<strong>Roll No:</strong>{" "}
{student.roll}
</p>
<p>

<strong>Course:</strong>{" "}
{student.course}
</p>

<p>
<strong>Email:</strong>{" "}
{student.email}
</p>

<button onClick={logout}>
Logout
</button>

</div>
</div>
);
}

/* ================= MAIN APP ================= */
export default function App() {
const [page, setPage] =
useState("signup");

const [student, setStudent] =
useState(null);

/* AUTO LOGIN */
useEffect(() => {
const session =
getSession();

if (session) {
setStudent(session);
setPage("dashboard");
}
}, []);

/* LOGOUT */
function logout() {
clearSession();

setStudent(null);

setPage("login");
}

/* CSS */
useEffect(() => {
const style =
document.createElement("style");

style.innerHTML = `
body{
margin:0;
font-family:Arial;
background:#f2f2f2;
}

.container{

display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
}

.box{
width:350px;
background:white;
padding:25px;
border-radius:10px;
box-shadow:0 0 10px rgba(0,0,0,0.1);
text-align:center;
}
h1{
margin-bottom:20px;
}

input{
width:100%;
padding:10px;
margin-top:10px;
border:1px solid #ccc;
border-radius:5px;

}

button{
width:100%;
padding:10px;
margin-top:15px;
border:none;
background:blue;
color:white;
border-radius:5px;
cursor:pointer;
}

span{
color:blue;
cursor:pointer;
font-weight:bold;
}
;

document.head.appendChild(style);

return () => {
document.head.removeChild(style);

};
}, []);

/* PAGE ROUTING */
if (page === "signup") {
return (
<Signup setPage={setPage} />
);
}

if (page === "login") {
return (
<Login
setPage={setPage}
setStudent={setStudent}
/>
);
}

return (
<Dashboard

student={student}
logout={logout}

/>
);
}

Output Screen: