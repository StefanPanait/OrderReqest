define(function(require) {
    'use strict';
    var $ = require('jquery');
    var utility = {
        navInit: function() {
            $(document).ready(function() {
                var element;
                switch (window.location.pathname) {
                    case "/":
                        element = $("#nav-dashboard");
                        break;
                    case "/shopping":
                        element = $("#nav-shopping");
                        break;
                    case "/orders":
                        element = $("#nav-orders");
                        break;
                    case "/manage/accounts":
                        element = $("#nav-manage-accounts");
                        break;
                    case "/manage/vendors":
                        element = $("#nav-manage-vendors");
                        break;
                    case "/manage/shop":
                        element = $("#nav-manage-shop");
                        break;
                    case "/manage/workflows":
                        element = $("#nav-manage-workflows");
                        break;
                }
                element.addClass("active");
            });
        },
        fetchURL: function(geturl) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", geturl, false);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    return xhr.responseText;
                } else {
                    return false;
                }
            };
            xhr.send();
        },
        postURL: function(posturl, data) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", posturl, false);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(data);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    return xhr.responseText;
                } else {
                    return false;
                }
            };
        },
        addCart: function() {
            $(document.body).on('click', '.addCart', function() {
                var id = $(this).attr('id');
                var getURL = window.location.origin + '/cart/add/' + id;
                fetchURL(getURL);
            });
        },
        submitCategory: function() {
            $(document.body).on('click', '.submitCategory', function() {
                var data = $('#categoryName').val();
                var posturl = window.location.origin + '/category/add';
                var jsonp = postURL(posturl, data);
            });
        },
        requestAccount: function() {
            $(document.body).on('click', '.requestAcc', function() {
                var setter = accounts[$(this).attr("id")];
                $("#email").text(setter.email);
                $("#notes").text(setter.note);
                $("#_id").val(setter.id);
            });
        },
        requestAction: function() {
            $(document.body).on('click', '.requestAction', function() {
                var geturl = window.location.origin + "/approve";
                if ($(this).hasClass("reject")) {
                    geturl = geturl + "/false/" + $("#email").text();
                    fetchURL(geturl);
                } else if ($(this).hasClass("approve")) {
                    geturl = geturl + "/true/" + $("#email").text();
                    fetchURL(geturl);
                }
            });
        },
        add: function() {
            $(document.body).on('click', '#add', function() {
                var temp = "<div id='after'><input type='text' name='q' placeholder='Approver&#39s Name' required>" +
                    '<button type="button" id="add">Add</button>' +
                    '<button type="button" id="remove">Remove</button>' +
                    "<br/></div>";
                $("#after").append(temp);
            });
        },
        remove: function() {
            $(document.body).on('click', '#remove', function() {
                $(this).closest('div').remove();
            });
        },
        renderView: function() {
            $(document.body).on('click', '.renderView', function() {
                var setter = accounts[$(this).attr("id")];
                $("#reqName").text(setter.firstName + " " + setter.lastName);
                $("#reqTitle").text(setter.title);
                $("#reqEmail").text(setter.username);
                $("#reqWorkPhone").text(setter.work_phone);
                $("#reqCellPhone").text(setter.cell_phone);
                $("#reqId").text($(this).attr("id"));
                $("#reqAddress").text(setter.address);
            });
        },
        removeCategory: function() {
            $(document.body).on('click', '.removeCategory', function() {
                $(".categoryID").val($(this).attr("id"));
            });
        },
        editCategory: function() {
            $(document.body).on('click', '.editCategory', function() {
                $(".categoryID").val($(this).attr("id"));
                $(".categoryName").val($("#categoryName").text());
            });
        }
    };
    return utility;
});
