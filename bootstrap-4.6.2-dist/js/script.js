$(document).ready(function () {
    $("#loginModal").modal('show');

    $('#btn_save').click(function (e) {
        let id = $('#movieId').val();
        let name = $('#movieName').val();
        let releaseDate = $('#releaseDate').val();
        let genre = $('#genre').val();

        // In bảng dữ liệu 
        let string = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + releaseDate + "</td><td>" + genre + "</td><td><button class='btn btn-primary editBtn'>Edit</button> <button class='btn btn-danger deleteBtn'>Delete</button></td></tr>";
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