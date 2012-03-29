﻿/*
    Ядро курсача
*/
var Kurs = {
    //Функция инициализации системы
    initialize: function () {
        if (!User.AuthState) {
            //Если пользователь не авторизирован, показываем ему окно входа во весь экран
            $('#authDialog').modal({
                backdrop: "static",
                keyboard: false
            });

            //Вешаем обработчик на нажатие кнопки авторизации
            $('#auth-login').click(Kurs.authorize);
            $('#authed').hide();
        } else {
            $('#auth-logout').click(Kurs.logout);
            $('#deauthed').hide();
        }

        //Заполняем контекст
        Kurs.Util.parseContext();

        //Указываем активную вкладку
        $('#nav-' + Kurs.Context.controller).addClass("active");
    },

    authorize: function () {
        var email = $('#auth-email').val();
        var pass = $('#auth-password').val();
        var data = {
            Email: email,
            Password: pass
        };

        Kurs.Util.sendRequest("Auth", "Index", data, Kurs.auth_succ, Kurs.auth_fail);
    },

    logout: function () {
        Kurs.Util.sendRequest("Auth", "LogOff", {}, function () {
            window.location = "/";
        }, function () {
            alert("Fail");
        });
    },

    /**
    * Поведение приложения при успехе авторизации
    */
    auth_succ: function (data) {
        if (data.AuthState) {
            User.AuthState = true;
            User.Email = data.Email;

            $('#authDialog').modal('hide');
            $('#authed-email').html(User.Email);
            $('#authed').show();
            $('#deauthed').hide();
        } else {
            $("#auth-fail").alert().show();
        }
    },

    /**
    * Поведение приложения при ошибке авторизации
    */
    auth_fail: function () {

    },

    /**
    * Неймспейс утилит
    */
    Util: {
        /**
        * Послать GET AJAX запрос к определённому контроллеру и экшену
        * 
        * @param string controller Контроллер
        * @param string action Экшен
        * @param Object data Объект параметров для вставки в запрос
        * @param Function callback_succ Коллбэк при удачном ответе
        * @param Function callback_fail Коллбэк при неудачном ответе
        */
        sendRequest: function (controller, action, data, callback_succ, callback_fail) {
            //Сеттим базовые параметры
            var params = {
                url: "/" + controller + "/" + action + "/",
                type: "GET",
                dataType: "json",
                data: data,
                success: callback_succ,
                error: callback_fail
            };

            //Выполняем запрос
            $.ajax(params);
        },

        parseContext: function () {
            var path = window.location.pathname.split("/")[1].toLowerCase();
            var hash = window.location.hash != "" ? window.location.hash.split("#")[1].toLowerCase() : null;

            //Дефолтный контекст
            if (path == "")
                path = "main";
            Kurs.Context.setValues(path, hash);
        }
    },

    Context: {
        controller: null,
        subpage: null,

        setValues: function (controller, subpage) {
            this.controller = controller;
            this.subpage = subpage;
        }
    }
}