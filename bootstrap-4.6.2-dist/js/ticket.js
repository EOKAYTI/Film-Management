$(document).ready(function () {

    $('#btn_save').click(function (e) {
        let name = $('#name').val();
        let email = $('#email').val();
        let ticketQuantity = $('#ticketQuantity').val();

        // In bảng dữ liệu 
        let string = "<tr><td>" + name + "</td><td>" + email + "</td><td>" + ticketQuantity + "</td><td><button class='btn btn-primary editBtn'>Edit</button> <button class='btn btn-danger deleteBtn'>Delete</button></td></tr>";
        $('#inputtable').append(string);

        // Xử lý sự kiện click cho nút Delete
        $('.deleteBtn').click(function () {
            $(this).closest('tr').remove(); // Xóa hàng gần nhất chứa nút được click
        });

        // Xử lý sự kiện click cho nút Edit
        $('.editBtn').click(function () {
            // Thường sẽ bao gồm việc lấy dữ liệu hàng hiện tại và điền vào form để chỉnh sửa

        });


    });
});
