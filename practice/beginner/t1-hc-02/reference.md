# Reference: How do HTML forms work, and why should inputs always have associated labels?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The `<form>` element collects user input and specifies submission destinations via `action` and HTTP methods (`GET` or `POST`). Inputs should always be paired with `<label>` elements using the `for` attribute (or `htmlFor` in React) matching the input’s `id`. This enables screen readers to announce what the input is for and improves usability by letting users click the label text to focus or toggle the input.",
    "example": "<form action=\"/api/login\" method=\"POST\">\n  <div class=\"form-group\">\n    <!-- Clicking the label focuses the input -->\n    <label for=\"user-email\">Email Address</label>\n    <input \n      type=\"email\" \n      id=\"user-email\" \n      name=\"email\" \n      required \n      placeholder=\"you@example.com\"\n    />\n  </div>\n  <button type=\"submit\">Log In</button>\n</form>",
    "code": "<label for=\"username\">Username</label>\n<input type=\"text\" id=\"username\" name=\"username\" required />",
    "followUp": {
      "question": "What happens when a form button with no type attribute is clicked inside a form?",
      "expectedAnswer": "By default, inside a <form>, an unspecified button defaults to type=\"submit\", which will trigger form submission and a page refresh unless preventDefault() is called."
    }
  },
  "expectedConcepts": [
    "The <form> element (action, method attributes)",
    "Input types (text, email, password, checkbox, radio, submit)",
    "Label pairing with id and htmlFor/for",
    "Usability and touch target increase"
  ]
}
```
