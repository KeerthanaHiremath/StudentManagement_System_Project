document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById("login-screen");
    const mainScreen = document.getElementById("main-screen");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const addBtn = document.getElementById("add-btn");
    const searchBtn = document.getElementById("search-btn");
    const updateBtn = document.getElementById("update-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const showBtn = document.getElementById("show-btn");
    const exportBtn = document.getElementById("export-btn");
    const exitBtn = document.getElementById("exit-btn");

    const searchContainer = document.getElementById("search-container");
    const searchInput = document.getElementById("search-input");
    const searchGoBtn = document.getElementById("search-go-btn");
    const searchClearBtn = document.getElementById("search-clear-btn");

    const studentTable = document.getElementById("student-table").getElementsByTagName("tbody")[0];

    const formContainer = document.getElementById("form-container");
    const formTitle = document.getElementById("form-title");
    const studentForm = document.getElementById("student-form");
    const formSubmitBtn = document.getElementById("form-submit-btn");
    const formCancelBtn = document.getElementById("form-cancel-btn");

    let students = [];
    let selectedStudentId = null;
    let isUpdating = false;

    // Hardcoded login credentials
    const validUsername = "admin";
    const validPassword = "password";

    function showLoginScreen() {
        loginScreen.classList.remove("hidden");
        mainScreen.classList.add("hidden");
        loginError.textContent = "";
        loginForm.reset();
        clearSelection();
        hideForm();
        hideSearch();
    }

    function showMainScreen() {
        loginScreen.classList.add("hidden");
        mainScreen.classList.remove("hidden");
        loadStudents();
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        if (username === validUsername && password === validPassword) {
            showMainScreen();
        } else {
            loginError.textContent = "Invalid username or password";
        }
    });

    function loadStudents(filteredStudents) {
        const data = filteredStudents || students;
        studentTable.innerHTML = "";
        data.forEach((student) => {
            const row = studentTable.insertRow();
            const selectCell = row.insertCell();
            const selectInput = document.createElement("input");
            selectInput.type = "radio";
            selectInput.name = "select-student";
            selectInput.value = student.id;
            selectInput.addEventListener("change", () => {
                selectedStudentId = student.id;
                updateBtn.disabled = false;
                deleteBtn.disabled = false;
            });
            selectCell.appendChild(selectInput);

            row.insertCell().textContent = student.id;
            row.insertCell().textContent = student.name;
            row.insertCell().textContent = student.mobile;
            row.insertCell().textContent = student.age;
            row.insertCell().textContent = student.course;
            row.insertCell().textContent = student.className;
            row.insertCell().textContent = student.email;
            row.insertCell().textContent = student.gender;
        });
        clearSelection();
    }

    function clearSelection() {
        selectedStudentId = null;
        updateBtn.disabled = true;
        deleteBtn.disabled = true;
        const radios = document.getElementsByName("select-student");
        radios.forEach(radio => radio.checked = false);
    }

    function showForm() {
        formContainer.classList.remove("hidden");
    }

    function hideForm() {
        formContainer.classList.add("hidden");
        studentForm.reset();
        isUpdating = false;
        formSubmitBtn.textContent = "Add";
    }

    function showSearch() {
        searchContainer.classList.remove("hidden");
    }

    function hideSearch() {
        searchContainer.classList.add("hidden");
        searchInput.value = "";
    }

    addBtn.addEventListener("click", () => {
        hideSearch();
        showForm();
        formTitle.textContent = "Add Student";
        formSubmitBtn.textContent = "Add";
        isUpdating = false;
        studentForm.reset();
    });

    updateBtn.addEventListener("click", () => {
        if (!selectedStudentId) return;
        hideSearch();
        showForm();
        formTitle.textContent = "Update Student";
        formSubmitBtn.textContent = "Update";
        isUpdating = true;
        const student = students.find(s => s.id === selectedStudentId);
        if (student) {
            document.getElementById("student-id").value = student.id;
            document.getElementById("student-id").disabled = true;
            document.getElementById("student-name").value = student.name;
            document.getElementById("student-mobile").value = student.mobile;
            document.getElementById("student-age").value = student.age;
            document.getElementById("student-course").value = student.course;
            document.getElementById("student-class").value = student.className;
            document.getElementById("student-email").value = student.email;
            document.getElementById("student-gender").value = student.gender;
        }
    });

    deleteBtn.addEventListener("click", () => {
        if (!selectedStudentId) return;
        if (confirm("Are you sure you want to delete this student?")) {
            students = students.filter(s => s.id !== selectedStudentId);
            loadStudents();
        }
    });

    showBtn.addEventListener("click", () => {
        hideForm();
        hideSearch();
        loadStudents();
    });

    exportBtn.addEventListener("click", () => {
        if (students.length === 0) {
            alert("No data to export");
            return;
        }
        const csvContent = "data:text/csv;charset=utf-8," +
            ["ID,Name,Mobile Number,Age,Course,Class,Email,Gender"]
            .concat(students.map(s => `${s.id},${s.name},${s.mobile},${s.age},${s.course},${s.className},${s.email},${s.gender}`))
            .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    exitBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            showLoginScreen();
        }
    });

    searchBtn.addEventListener("click", () => {
        hideForm();
        showSearch();
    });

    searchGoBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            loadStudents();
            return;
        }
        const filtered = students.filter(s =>
            s.id.toLowerCase().includes(query) ||
            s.name.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query)
        );
        loadStudents(filtered);
    });

    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        loadStudents();
    });

    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("student-id").value.trim();
        const name = document.getElementById("student-name").value.trim();
        const mobile = document.getElementById("student-mobile").value.trim();
        const age = document.getElementById("student-age").value.trim();
        const course = document.getElementById("student-course").value.trim();
        const className = document.getElementById("student-class").value.trim();
        const email = document.getElementById("student-email").value.trim();
        const gender = document.getElementById("student-gender").value;

        if (!id || !name || !mobile || !age || !course || !className || !email || !gender) {
            alert("All fields are required.");
            return;
        }

        if (isUpdating) {
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) {
                students[index] = { id, name, mobile, age, course, className, email, gender };
                alert("Student updated successfully.");
            }
        } else {
            if (students.some(s => s.id === id)) {
                alert("Student ID already exists.");
                return;
            }
            students.push({ id, name, mobile, age, course, className, email, gender });
            alert("Student added successfully.");
        }
        hideForm();
        loadStudents();
    });

    formCancelBtn.addEventListener("click", () => {
        hideForm();
    });

    // Initialize
    showLoginScreen();
});
