var bearerToken;
var signined;
var username;
var messageReturn;
var bearerToken;
var signined;
var isSuccess = false;
var idSelect;
var lineSelect;
var announce;
function getBearerToken(){
    announce = $("#announce");
  return localStorage.getItem("bearerToken");
}
function authorize(){
    $.ajax({
      url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
      type: "POST",
      dataType: "xml",
      data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <soapenv:Body>
        <q0:getRoleFromToken>
          <q0:data>${localStorage.getItem("bearerToken")}</q0:data>
        </q0:getRoleFromToken>
      </soapenv:Body>
    </soapenv:Envelope>`,
      contentType: "text/xml",
      async: false,
      headers: {
        "SOAPAction": "",
        "Authentication":localStorage.getItem("bearerToken"),
        "CustomRequired":"none"

      },
      statusCode: {
        404: function() {
            // Xử lý lỗi 404 (Not Found)
            console.log("Lỗi 404 - Không tìm thấy trang");
        },
        401: function() {
            // Xử lý lỗi 401 (Unauthorized)
            console.log("Lỗi 401 - Không được phép truy cập");
        }
    },
      success: function(response) {
      //    console.log(response);
        docs= $(response).find("getRoleFromTokenReturn").text();
        console.log(docs);
        let authenticationReturn = JSON.parse(docs);
        if(authenticationReturn!=null){
          if(authenticationReturn.status ==true){
            if(authenticationReturn.data != 1){
              window.location.href = '403.html';
              return false;
            }else{
              sessionStorage.setItem("oldLink",window.location.href);
              return true;
            }
            
              
          }
        }
      }
    });
}
function generateDateTimeOpt(){
  $.ajax({
    url: "http://localhost:8080/MovieTicketManagementVer3/services/MovieTimeServiceImp",
    type: "POST",
    dataType: "xml",
    data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
      <q0:getAll/>
    </soapenv:Body>
  </soapenv:Envelope>`,
    contentType: "text/xml",
    async: false,
    headers: {
      "SOAPAction": "",
      "Authentication":getBearerToken()
    },
    statusCode: {
      404: function() {
          // Xử lý lỗi 404 (Not Found)
          console.log("Lỗi 404 - Không tìm thấy trang");
      },
      401: function() {
          // Xử lý lỗi 401 (Unauthorized)
          console.log("Lỗi 401 - Không được phép truy cập");
          signined = false;
          messageReturn = "Vui lòng đăng nhập để tiếp tục!";
      }
  },
    success: function(response) {
    //    console.log(response);
      docs= $(response).find("getAllResponse").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
          let tbody ='<option value="" selected>Vui lòng chọn</option>';
            docsReturn.data.forEach(function(element){
              
              tbody+=`
              <option value="${element.id}">${element.time}</option>
             `;
            });
            
             $("#datetime").html(tbody);

            
        }else{
            messageReturn = "";
            $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
        }
      
    }
  });
  if(!signined){
    $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
    setTimeout(function(){
      window.location.href = "login.html";
  }, 2500);
  }
}
function generateCategoryFilmOpt(){
  $.ajax({
    url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
    type: "POST",
    dataType: "xml",
    data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
      <q0:getAll/>
    </soapenv:Body>
  </soapenv:Envelope>`,
    contentType: "text/xml",
    async: false,
    headers: {
      "SOAPAction": "",
      "Authentication":getBearerToken()
    },
    statusCode: {
      404: function() {
          // Xử lý lỗi 404 (Not Found)
          console.log("Lỗi 404 - Không tìm thấy trang");
      },
      401: function() {
          // Xử lý lỗi 401 (Unauthorized)
          console.log("Lỗi 401 - Không được phép truy cập");
          signined = false;
          messageReturn = "Vui lòng đăng nhập để tiếp tục!";
      }
  },
    success: function(response) {
    //    console.log(response);
      docs= $(response).find("getAllReturn").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
            let tbody ='<option value="" selected>Vui lòng chọn</option>';
            docsReturn.data.forEach(function(element){
              
              tbody+=` 
              <option value="${element.id}">${element.name}</option>
             `;
            });
            
             $("#category").html(tbody);

            
        }else{
            messageReturn = "";
            $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
        }
      
    }
  });
  if(!signined){
    $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
    setTimeout(function(){
      window.location.href = "login.html";
  }, 2500);
  }
}
function checkLogin(){
    // get token
    bearerToken = localStorage.getItem("bearerToken");
    // check login
    signined = false;
    username = null;
    messageReturn = "";
    alertModal = $("#alert-modal");
    $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
        type: "POST",
        dataType: "xml",
        data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <q0:getUsernameFromToken>
            <q0:data>${bearerToken}</q0:data>
          </q0:getUsernameFromToken>
        </soapenv:Body>
      </soapenv:Envelope>`,
        contentType: "text/xml",
        async: false,
        headers: {
          "SOAPAction": "",
          "Authentication":getBearerToken(),
          "CustomRequired":""
        },
        statusCode: {
          404: function() {
              // Xử lý lỗi 404 (Not Found)
              console.log("Lỗi 404 - Không tìm thấy trang");
              
          },
          401: function() {
              // Xử lý lỗi 401 (Unauthorized)
              console.log("Lỗi 401 - Không được phép truy cập");
              signined = false;
          messageReturn = "Vui lòng đăng nhập để tiếp tục!";
              
          }
      },
        success: function(response) {
            console.log(response);
          docs= $(response).find("getUsernameFromTokenReturn").text();
          console.log(docs);
          let docsReturn = JSON.parse(docs);
          console.table(docsReturn);
          if(docsReturn!=null){
            console.log(docsReturn.status);
            if(docsReturn.status ==true){
                console.log("status = true");
                signined = true
                username = docsReturn.data;
                // alert(message);
            }else{
                messageReturn = "Vui lòng đăng nhập để tiếp tục!";
                // alert(message);
                $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
                if(!signined){
                  setTimeout(function(){
                    window.location.href = "login.html";
                }, 2500);
                }
            }
          }
        }
        
        
      });
      if(username!=null && username!=""){
          $(".username").text(username);
          $(".info-login").removeClass('d-none');
      }else{
        $(".info-login").addClass('d-none');
      }
      return signined;
}

function generateData(){
      console.log("active");
  $.ajax({
    url: "http://localhost:8080/MovieTicketManagementVer3/services/FirmServiceImp",
    type: "POST",
    dataType: "xml",
    data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
      <q0:getAll/>
    </soapenv:Body>
  </soapenv:Envelope>`,
    contentType: "text/xml",
    async: false,
    headers: {
      "SOAPAction": "",
      "Authentication":getBearerToken()
    },
    statusCode: {
      404: function() {
          // Xử lý lỗi 404 (Not Found)
          console.log("Lỗi 404 - Không tìm thấy trang");
      },
      401: function() {
          // Xử lý lỗi 401 (Unauthorized)
          console.log("Lỗi 401 - Không được phép truy cập");
          signined = false;
          messageReturn = "Vui lòng đăng nhập để tiếp tục!";
      }
  },
    success: function(response) {
     console.log(response);
      docs= $(response).find("getAllReturn").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
            let tbody ="";
            docsReturn.data.forEach(function(element){
              
              tbody+=` <tr>
              <td>${element.id}</td>
              <td>${element.category.name}</td>
              <td>${element.name}</td>
              <td>${element.price}</td>
              <td>${element.time.time}</td>
              <td>${element.seatQuantity}</td>

              <td>
                  <button id ="${element.id}" class='btn btn-danger deleteBtn btn-action'>Delete</button>
              </td>
              </tr>
             `;
            });
            
             $("#staff-table-content").html(tbody);

            
        }else{
            messageReturn = "";
            $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
        }
      
    },error: function(xhr, status, error) {
      // Xử lý lỗi
      console.error(error);
    }
  });
  if(!signined){
    $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
    setTimeout(function(){
      window.location.href = "login.html";
  }, 2500);
  }
}

$(document).ready(function () {
  if(checkLogin()){
    authorize();
  generateData();
    }
    // generate data
    // logout
    $("#logout-btn").on("click",function(){
      localStorage.setItem("bearerToken",null);
      checkLogin();
    })
    



    $('#btn_save').click(function (e) {
        let category = $('#category').val();
        let filmName = $('#film-name').val();
        let price = $('#price').val();
        let datetime = $('#datetime').val();
        let seatQuantity = $('#seat-quantity').val();
        console.log("check 1:",category);
        console.log("check 2:",filmName);
        console.log("check 3:",price);
        console.log("check 4:",datetime);
        console.log("check 5:",seatQuantity);
        // validating
        let isValid = false;
        let message = "";
        if(category==null||category==""){
             message ="Vui lòng lựa chọn loại phim.";
            //  console.log("not valid")
        }
        else  if(filmName==null||filmName==""){
          message ="Vui lòng điền tên phim.";
         //  console.log("not valid")
        }
        else  if(price==null||price==""||price<0){
          message ="Giá phim không hợp lệ.";
         //  console.log("not valid")
        }
        else if(datetime==null||datetime==""){
          message ="Vui lòng lựa chọn ngày giờ chiếu phim.";
         //  console.log("not valid")
        }
        else if(seatQuantity==null||seatQuantity==""||seatQuantity<0){
          message ="Số lượng ghế không hợp lệ.";
         //  console.log("not valid")
        }
        else{
            isValid = true;
            message ="";
            $("#employeeManagementModal").modal('hide');

        }
        announce.text(message);
        if(isValid){
            // insert to server
            $.ajax({
              url: "http://localhost:8080/MovieTicketManagementVer3/services/FirmServiceImp",
              type: "POST",
              dataType: "xml",
              data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <soapenv:Body>
                <q0:create>
                  <q0:model>
                    <q1:category>
                      <q1:id>${category}</q1:id>
                      <q1:name>none</q1:name>
                    </q1:category>
                    <q1:id>0</q1:id>
                    <q1:name>${filmName}</q1:name>
                    <q1:price>${price}</q1:price>
                    <q1:seatQuantity>${seatQuantity}</q1:seatQuantity>
                    <q1:time>
                      <q1:id>${datetime}</q1:id>
                      <q1:time>none</q1:time>
                    </q1:time>
                  </q0:model>
                </q0:create>
              </soapenv:Body>
            </soapenv:Envelope>`,
              contentType: "text/xml",
              async: false,
              headers: {
                "SOAPAction": "",
                "Authentication":getBearerToken()
              },
              statusCode: {
                404: function() {
                    // Xử lý lỗi 404 (Not Found)
                    console.log("Lỗi 404 - Không tìm thấy trang");
                },
                401: function() {
                    // Xử lý lỗi 401 (Unauthorized)
                    console.log("Lỗi 401 - Không được phép truy cập");
                }
            },
              success: function(response) {
              //    console.log(response);
                docs= $(response).find("createReturn").text();
               
                let docsReturn = JSON.parse(docs);
                console.log(docsReturn);
                
                  // console.log(docsReturn.status);
                  if(docsReturn!=null){
                      if(docsReturn.status==true){
                        isSuccess = true
                      }else{
                        messageReturn =docsReturn.message;
                      }
                  }
                
              }
            });
            if(isSuccess){
              $("#message-content").text("Tạo thành công!");
              generateData();
              $("#create-form").trigger('reset')
            }else{
              $("#message-content").text(messageReturn);
            }
            alertModal.modal("show");
        }

        // In bảng dữ liệu 
        // let string = "<tr><td>" + employeeID + "</td><td>" + employeeName + "</td><td>" + employeeRole + "</td><td><button class='btn btn-primary editBtn'>Edit</button> <button class='btn btn-danger deleteBtn'>Delete</button></td></tr>";
        // $('#inputtable').append(string);

        // Xử lý sự kiện click cho nút Delete
       


    });

    $("#staff-table-content").on("click",'.deleteBtn',function () {
      if(checkLogin()){
        $("#confirm-delete-modal").modal("show");
        idSelect = $(this).attr("id");
        lineSelect = $(this);
      }
     
      
  });
    $("#confirm-delete-btn").on("click",function(){
      $("#confirm-delete-modal").modal("hide");
      let isSuccess = false;
      messageReturn = "";
      $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/FirmServiceImp",
        type: "POST",
        dataType: "xml",
        data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <q0:deleteById>
            <q0:id>${idSelect}</q0:id>
          </q0:deleteById>
        </soapenv:Body>
      </soapenv:Envelope>`,
        contentType: "text/xml",
        async: false,
        headers: {
          "SOAPAction": "",
          "Authentication":getBearerToken()
        },
        statusCode: {
          404: function() {
              // Xử lý lỗi 404 (Not Found)
              console.log("Lỗi 404 - Không tìm thấy trang");
          },
          401: function() {
              // Xử lý lỗi 401 (Unauthorized)
              console.log("Lỗi 401 - Không được phép truy cập");
              signined = false;
              messageReturn = "Vui lòng đăng nhập để tiếp tục!";
          }
      },
        success: function(response) {
        //    console.log(response);
          docs= $(response).find("deleteByIdResponse").text();
         
          let docsReturn = JSON.parse(docs);
          console.log(docsReturn);
          
            // console.log(docsReturn.status);
            if(docsReturn!=null){
                if(docsReturn.status==true){
                  isSuccess = true
                  
                }
            }
          
        }
      });
      if(!signined){
        setTimeout(function(){
          window.location.href = "login.html";
      }, 0);
      }
      if(isSuccess){
       messageReturn = "Xóa thành công!";
       lineSelect.closest('tr').remove(); // Xóa hàng gần nhất chứa nút được click
                
      }else{
        messageReturn = "Xóa thất bại, loại phim không tồn tại!";
        generateData();
      }
      $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
      //
    })

  // Xử lý sự kiện click cho nút Edit
  var idEdit ;
  $("#staff-table-content").on("click",".editBtn",function () {
    checkLogin();
    idEdit = $(this).attr("id");
    console.log(idEdit)
    $("#modifyEmployeeModal").modal('show');
      // Thường sẽ bao gồm việc lấy dữ liệu hàng hiện tại và điền vào form để chỉnh sửa
  });

  $("#btn_save-edit").on('click',function(){
    let message = "";
     let textEdit = $("#edit").val();
     if(textEdit=="") message = "Vui lòng điền tên loại phim.";
     console.log("check id:",idEdit);
      $("#announce-edit").text(message);
      if(message==""){
        // valid
        $("#modifyEmployeeModal").modal('hide');
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
          type: "POST",
          dataType: "xml",
          data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <q0:updateById>
              <q0:model>
                <q1:id>${idEdit}</q1:id>
                <q1:name>${textEdit}</q1:name>
              </q0:model>
            </q0:updateById>
          </soapenv:Body>
        </soapenv:Envelope>`,
          contentType: "text/xml",
          async: false,
          headers: {
            "SOAPAction": "",
            "Authentication":getBearerToken()
          },
          statusCode: {
            404: function() {
                // Xử lý lỗi 404 (Not Found)
                console.log("Lỗi 404 - Không tìm thấy trang");
            },
            401: function() {
                // Xử lý lỗi 401 (Unauthorized)
                console.log("Lỗi 401 - Không được phép truy cập");
            }
        },
          success: function(response) {
          //    console.log(response);
            docs= $(response).find("updateByIdReturn").text();
           
            let docsReturn = JSON.parse(docs);
            console.log(docsReturn);
            
              // console.log(docsReturn.status);
              if(docsReturn!=null){
                  if(docsReturn.status==true){
                    isSuccess = true
                    
                  }
              }
            
          }
        });
        if(isSuccess){
          messageReturn = "Sửa thành công!";
         
          $("#edit-form").trigger("reset");
          generateData();
        }else{
          messageReturn = "Thất bại, không tìm thấy!";
        }
        $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
        
      }
  })

    $("#create-button").on("click",function(){
      if(checkLogin()){
        generateCategoryFilmOpt();
        generateDateTimeOpt();
        $("#employeeManagementModal").modal('show');
      }
      
    })
    $("#find-btn").on("click",function(){
        // alert("find function actived")
        let complexData = $("#complex-data").val();
        console.log("check complexData:",complexData);
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/FirmServiceImp",
          type: "POST",
          dataType: "xml",
          data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <q0:getByComplexData>
              <q0:data>${complexData}</q0:data>
            </q0:getByComplexData>
          </soapenv:Body>
        </soapenv:Envelope>`,
          contentType: "text/xml",
          async: false,
          headers: {
            "SOAPAction": "",
            "Authentication":getBearerToken()
          },
          statusCode: {
            404: function() {
                // Xử lý lỗi 404 (Not Found)
                console.log("Lỗi 404 - Không tìm thấy trang");
            },
            401: function() {
                // Xử lý lỗi 401 (Unauthorized)
                console.log("Lỗi 401 - Không được phép truy cập");
                signined = false;
                messageReturn = "Vui lòng đăng nhập để tiếp tục!";
            }
        },
          success: function(response) {
             console.log("check response",response);
            docs= $(response).find("getByComplexDataReturn").text();
            console.log("docs:",docs);
      
            let docsReturn = JSON.parse(docs);
            console.log(docsReturn);
      
              // console.log(docsReturn.status);
              if(docsReturn!=null){
                  let tbody ="";
                  docsReturn.data.forEach(function(element){
                    tbody+=` <tr>
                    <td>${element.id}</td>
                    <td>${element.category.name}</td>
                    <td>${element.name}</td>
                    <td>${element.price}</td>
                    <td>${element.time.time}</td>
                    <td>${element.seatQuantity}</td>
      
                    <td>
                        <button id ="${element.id}" class='btn btn-danger deleteBtn btn-action'>Delete</button>
                    </td>
                    </tr>
                   `;
                  });
                  
                   $("#staff-table-content").html(tbody);
                  
      
                  
              }else{
                  messageReturn = "";
                  $("#message-content").text(messageReturn);
                  if(messageReturn!=""){
                    alertModal.modal("show");
                  }
              }
            
          }
        });
        if(!signined){
          $("#message-content").text(messageReturn);
                  if(messageReturn!=""){
                    alertModal.modal("show");
                  }
          setTimeout(function(){
            window.location.href = "login.html";
        }, 2500);
        }
        
    })
});
