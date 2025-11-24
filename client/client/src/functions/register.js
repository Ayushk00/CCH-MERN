import axios from 'axios';

export const handleRegister = (e, name, email, password, role) => {
    e.preventDefault();
    let url;
    if (role === 'student') {
        url = 'http://localhost:3000/api/student/register';
    } else if (role === 'company') {
        url = 'http://localhost:3000/api/company/register';
    } else if (role === 'admin') {
        url = 'http://localhost:3000/api/admin/register';
    } else {
        throw new Error('Invalid role');
    }

    axios
        .post(url, { name, email, password })
        .then((res) => {
            console.log(res);
            if (res.status === 201) {
                alert('Registered Successfully');
                window.location.href = '/login';
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
