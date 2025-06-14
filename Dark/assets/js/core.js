(function(window) {
    // Define Modiran class
    function Modiran() {

        var toggleSidebarSwitch = document.querySelector(".toggle-sidebar-switch");
        var creativeSidebarSwitch = document.querySelector(".creative-sidebar-switch");
        var fixHeaderSwitch = document.querySelector(".fix-header-switch");
        
        // Initilize metisMenu
        this.initMetisMenu = function(){
            if (typeof metisMenu != "undefined"){
                $("#side-menu").metisMenu();
            }
        };
        

        // Check old IE browsers and show appropriate notice
        this.checkOldIE = function(){
            if ($.browser.msie && $.browser.version < 9) {
               $("#page-content").prepend('<p class="alert alert-warning">مرورگر شما منسوخ و تاریخ گذشته است. از سایت  <a href="http://browsehappy.com/">browsehappy(مرور شاد اینترنت)</a> ، اقدام به به روز رسانی کنید</p>');
            }
        };


        // Handle toggle-sidebar-top button
        this.toggleSidebarTop = function() {
            $("#toggle-sidebar-top").on("click", function(e) {
                e.preventDefault();
                var btn  = $(this),
                    icon = $(this).find("i");

                if (btn.hasClass("open")) {
                    btn.removeClass("open");
                    icon.removeClass("icon-user-following").addClass("text-danger icon-user-unfollow");

                    $(".sidebar-top").slideUp();
                } else {
                    btn.addClass("open");
                    icon.removeClass("text-danger icon-user-unfollow").addClass("icon-user-following");

                    $(".sidebar-top").slideDown();
                }
            });
        };


        // Handle toggle-sidebar button
        this.toggleSidebar = function() {
            $("#toggle-sidebar").on("click", function(e) {
                e.preventDefault();
                if ($("body").hasClass("sidebar-collapse")) {
                    window.Modiran.changeSidebarState("expand");
                } else {
                    window.Modiran.changeSidebarState("collapse");
                }
            });
        };


        // Handle toggle-sidebar button
        this.toggleDarkMode = function() {
            $("#toggle-dark-mode").on("click", function(e) {
                e.preventDefault();
                if ($("body").hasClass("dark")) {
                    window.Modiran.darkMode(false);
                } else {
                    window.Modiran.darkMode(true);
                }
                return;
            });
        };

        // Change sidebar state
        this.changeSidebarState = function(newState){
            
            if(newState==="collapse"){
                $("body").addClass("sidebar-collapse");
                $(".metismenu>li").removeClass("active");
                $(".metismenu > li > ul").removeClass("in");
                
                
                if(!toggleSidebarSwitch.checked){
                    $('.toggle-sidebar-switch').trigger('click');
                }
            }else{
                $("body").removeClass("sidebar-collapse");
                
                if(toggleSidebarSwitch.checked){
                    $('.toggle-sidebar-switch').trigger('click');
                }
            }
            
            window.Modiran.updateSettingCodes();
        };


        // Change sidebar state
        this.darkMode = function(newState){
            
            if(newState==true){
                $("body").addClass("dark");
            }else{
                $("body").removeClass("dark");
            }
            
            window.Modiran.updateSettingCodes();
        };


        // Handle btn-status
        this.handleStatusButton = function() {
            $(".dropdown-status>li>a").on("click", function(e) {
                e.preventDefault();
                $(".btn-status").html($(this).html());
            });
        };
        

        // Define tooltip
        this.tooltip = function() {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll("[rel='tooltip'], .has-tooltip"))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        };

        // Handle code button
        this.handleCodeButton = function() {
            $(".btn-code").on("click", function(e) {
                e.preventDefault();
                    
                var result = escapeHtml($(this).parent().find(".code-modal").html());
                result = "<pre class='codes'><code id='code-for-copy'>" + result + "</code></pre>";

                $("#code-modal .modal-body").html(result);
                $("#code-modal").modal("show");
            });
        };

        // Handle code copy button
        this.handleCopyCodeButton = function() {
            $("#btn-copy").on("click", function() {
                var text = document.getElementById("code-for-copy");
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);

                document.execCommand('copy');
            });
        };

        // Define popover
        this.popover = function() {
            var popoverTriggerList = [].slice.call(document.querySelectorAll("[data-toggle='popover'] .has-popover"))
            var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl)
            })
        };


        // Define toggleFullScreen
        this.toggleFullScreen = function() {
            if (typeof screenfull !== "undefined"){
                if (screenfull.isEnabled) {
                    $("#toggle-fullscreen").click(function(){      
                        $(this).find("i").toggleClass("icon-size-fullscreen icon-size-actual");
                        screenfull.toggle();
                    });
                }else{
                    $("#toggle-fullscreen").addClass("hide");
                }
            }
        };


        // Define boxFullScreen
        this.boxFullScreen = function() {
            if (typeof screenfull !== "undefined"){
                // IE 11 issue
                //screenfull.on("change", (e) => {
                //    var toggledBox = $(e.target);
                //    toggledBox.toggleClass("full");
                //    $(toggledBox).find(".buttons-box .btn-fullscreen i").toggleClass("icon-size-fullscreen icon-size-actual");
                //});
                $(".btn-fullscreen").on("click", function(e) {
                    e.preventDefault();
                    var toggledPanel = $(this).parents(".box")[0];
                    screenfull.toggle(toggledPanel);
                });
           
            }
        };


        // Define boxCollapse
        this.boxCollapse = function(e) {
            var collapseButton = $(".btn-collapse");

            collapseButton.on("click", function(e) {
                e.preventDefault();
                bodyClasses = ".panel-body, .portlet-body";
                $(this).closest(".box").find(bodyClasses).slideToggle();
                $(this).find("i").toggleClass("icon-arrow-up icon-arrow-down");
            });
        };


        // Define boxHide
        this.boxHide = function() {
            $(".buttons-box .btn-close").on("click", function(e) {
                e.preventDefault();
                $(this).closest(".box").animate(
                        {"opacity":"0"},
                        500 ,
                        function(){$(this).closest(".box").hide("fast");});
            });
        };
        

        // Define buttonsBoxCollapse
        this.buttonsBoxCollapse = function() {
            var collapseButton = $(".buttons-box .btn-toggle");

            collapseButton.on("click", function(e) {
                e.preventDefault();
                
                $(this).parent().toggleClass("show");
            });
        };
        

        // Handle settings box
        this.handleSettings = function() {
            // Toggle box button 
            $("#toggle-setting").on("click", function(e) {
                e.preventDefault();
                
                $(this).parent().toggleClass("active");
            });
            
            // Change Theme Color
            $(".theme-colors .btn").on("click", function(e) {
                e.preventDefault();
                
                var colorName = $(this).attr("data-color");

                // Remove current theme color class
                $("body").removeClass (function (index, css) {
                    return (css.match (/(^|\s)theme-\S+/g) || []).join(" ");
                });
                // Add new theme color class
                $("body").addClass("theme-" + colorName);
                $(".theme-colors .btn").removeClass("active");
                $(this).addClass("active");

                window.Modiran.updateSettingCodes();
            });

            // Change Sidebar Background
            $(".sidebar-bg li").on("click", function(e) {
                e.preventDefault();
                
                var bgCode = $(this).find("img").attr("data-bg");

                // Remove current bg class
                $("body").removeClass (function (index, css) {
                    return (css.match (/(^|\s)bg-\d+/g) || []).join(" ");
                });

                if(bgCode){
                    // Add new bg class
                    $("body").addClass("bg-" + bgCode);
                }

                $(".sidebar-bg li").removeClass("active");
                $(this).addClass("active");
                window.Modiran.updateSettingCodes();
            });
            
            // Update code guide box
            this.updateSettingCodes = function(){
                var headerStatus = sidebarStatus = creativeSidebarStatus = darkModeStatus = "";
                var currentColor = $(".theme-colors .btn.active").attr("data-color");
                var currentSidebarBg = $("ul.sidebar-bg li.active img").attr("data-bg");
                var themeColor = "theme-" + currentColor;

                var sidebarBg = "";
                if(currentSidebarBg){
                    sidebarBg = " bg-" + currentSidebarBg;
                }
                
                if (typeof Switchery != "undefined"){
                    if(fixHeaderSwitch.checked){
                        headerStatus = " fix-header";
                    }

                    if(toggleSidebarSwitch.checked){
                        sidebarStatus = " sidebar-collapse";
                    }
                    
                    if(!creativeSidebarSwitch.checked){
                        creativeSidebarStatus = " sidebar-extra";
                    }

                    if($("body").hasClass("dark")){
                        darkModeStatus = " dark";
                    }
                }
                
                var result = escapeHtml('<body class="' + themeColor + sidebarBg + headerStatus + sidebarStatus + creativeSidebarStatus + darkModeStatus + '">');
                $(".theme-code code").html(result);
                
                
            }
            window.Modiran.updateSettingCodes();
        };
        
        
        // Handle ripple effect
        this.handleRipple = function() {
            var rippleTargets = document.querySelectorAll(".active-ripple .btn:not(.no-ripple), .active-ripple .metismenu a, .ripple-effect");

            [].forEach.call(rippleTargets, function(button) {
                var ripple = new PaperRipple();
                button.appendChild(ripple.$);
                button.addEventListener("mousedown", function(ev) {
                    ripple.downAction(ev);
                    ripple.upAction();
                });
            });
        };
        
        
        // Handle  switcheries
        this.handleSwitchery = function(){
            if (typeof Switchery != "undefined"){
                var size = "small",
                    color = "#999";
                new Switchery(fixHeaderSwitch,
                { 
                    size: size, 
                    color: color
                });
                fixHeaderSwitch.onchange = function() {
                    // Fix header setting
                    if(fixHeaderSwitch.checked){
                        $("body").addClass("fix-header");
                        $("#main-navbar").addClass("navbar-fixed-top");
                    }else{
                        $("body").removeClass("fix-header");
                        $("#main-navbar").removeClass("navbar-fixed-top");
                    }

                    window.Modiran.updateSettingCodes();
                };

                new Switchery(toggleSidebarSwitch,
                { 
                    size: size, 
                    color: color
                });
                toggleSidebarSwitch.onchange = function() {
                    // Sidebar toggle setting
                    if(toggleSidebarSwitch.checked){
                        window.Modiran.changeSidebarState("collapse");
                    }else{
                        window.Modiran.changeSidebarState("expand");
                    }
                };

                new Switchery(creativeSidebarSwitch,
                { 
                    size: size, 
                    color: color
                });
                creativeSidebarSwitch.onchange = function() {
                    // Sidebar creative switch
                    if(creativeSidebarSwitch.checked){
                        if($('body').hasClass("sidebar-extra")){
                            $('body').removeClass("sidebar-extra");
                        }
                    }else{
                        if(!$('body').hasClass("sidebar-extra")){
                            $('body').addClass("sidebar-extra");
                        }
                    }
                    window.Modiran.updateSettingCodes();
                };
            }
        };
        
        // Handle scrollbars
        this.handleScrollbars = function(){
            if (typeof mCustomScrollbar != "undefined"){
                $(".dropdown-menu.has-scrollbar").mCustomScrollbar({
                    scrollInertia: 100,
                    setHeight: 300,
                    theme: "minimal-dark"
                });
                $(".has-scrollbar").mCustomScrollbar({
                    theme: "minimal-dark"
                });
            }
        };
        
        // Initilize sweet alert
        this.initiSwal = function(){
            if (typeof swal != "undefined"){
                swal.setDefaults({
                    confirmButtonText: 'تائید',
                    cancelButtonText: 'لغو'
                });
            }
        };
        
        // Initilize iCkeck
        this.initiCkeck = function(){
            $("input:not(.normal)").iCheck({
                checkboxClass: 'icheckbox_square-grey',
                radioClass: 'iradio_square-grey'
            });
        };
        
        // Handle numeric text inputs
        this.handleNumericInputs = function(){
            $(document).on("input", ".numeric", function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            $(document).on("blur", ".numeric", function () {
                if ($(this).attr("max")) {
                    var max = parseInt($(this).attr("max"));
                    var entered = parseInt(this.value);
                    if (entered > max) this.value = max;
                }
                if ($(this).attr("min")) {
                    var min = parseInt($(this).attr("min"));
                    var entered = parseInt(this.value);
                    if (entered < min) this.value = min;
                }
            });
        };
        
        // Toggle button to switch between password and text input
        this.handleTogglePassword = function(){
            $(document).on("click", ".btn-toggle-pass", function() {
                if($(this).hasClass("active")){
                    $(this).closest(".input-group").find("input").attr("type", "password");
                    $(this).removeClass("active");
                }else{
                    $(this).closest(".input-group").find("input").attr("type", "text");
                    $(this).addClass("active");
                }
            });
        };
    }

    // Creates a Modiran object.
    window.Modiran = new Modiran();
})(window);


function escapeHtml(text) {
    if (text == null) return;
    
    var html = text
        .replace(/<!--/g, "")
        .replace(/-->/g, "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/^\s*/g, "")
        .replace(/\s*$/g, "");

    return html;
        
}
(function($) {
    $(document).ready(function() {
        Modiran.initMetisMenu();
        Modiran.checkOldIE();
        Modiran.toggleDarkMode();
        Modiran.toggleSidebarTop();
        Modiran.handleStatusButton();
        Modiran.toggleSidebar();
        Modiran.handleCodeButton();
        Modiran.handleCopyCodeButton();
        Modiran.tooltip();
        Modiran.popover();
        Modiran.toggleFullScreen();
        Modiran.boxFullScreen();
        Modiran.boxCollapse();
        Modiran.boxHide();
        Modiran.buttonsBoxCollapse();
        Modiran.handleSettings();
        Modiran.handleRipple();
        Modiran.handleSwitchery();
        Modiran.handleScrollbars();
        Modiran.initiSwal();
        Modiran.initiCkeck();
        Modiran.handleNumericInputs();
        Modiran.handleTogglePassword();
    });
    
    // Handle file inputs
    $(".form-control[type='file']").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).parent().find("input[type='text']").val(fileName);
    });

    $(window).on("load", function () {
        // Animate loader off screen
        $("#loader").animate({
            "opacity": "0"
        }, 
        10, 
        function(){
            $("#loader").css("display","none");
        });
    });

    // Handle scroll class for header
    $(window).scroll(function(){
        if (document.documentElement.scrollTop > 70) {
            if(!$("body").hasClass("scrolled")){
               $("body").addClass("scrolled");
            }
        } else {
            if($("body").hasClass("scrolled")){
                $("body").removeClass("scrolled");
            }
        }
    });

    // Handle plus, minus buttons for card quantity
    $(document).on("click", ".quantity .btn-minus", function(e) {
        e.preventDefault();
        var input = $(this).closest(".quantity").find("input");
        var value = parseInt(input.val());
        var min = parseInt(input.attr("min"));

        if (value > min) {
            value = value - 1;
        } else {
            value = min;
        }
        input.val(value);
    });
    $(document).on("click", ".quantity .btn-plus", function(e) {
        e.preventDefault();
        var input = $(this).closest(".quantity").find("input");
        var value = parseInt(input.val());
        var max = parseInt(input.attr("max"));

        if (value < max) {
            value = value + 1;
        } else {
            value = max;
        }
        input.val(value);
    });
    
    // Separator for numbers
    function numberFormat(num) {
        var n = num.toString(), p = n.indexOf('.');
        return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function ($0, i) {
            return p < 0 || i < p ? ($0 + ',') : $0;
        });
    }
    $(document).on("keyup", "input.numeric.separate, input.numeric-float.separate", function () {
        $(this).val(numberFormat($(this).val()));
    });


    // Convert Persian numbers to English numbers
    function englishNumber(value) {
        if (!value) {
            return '';
        }
        var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        var persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        return value;
    }
    

    // Close settings or sidebar if clicked point was out of them
    $(document).mouseup(function(e) 
    {
        var container = $(".settings");
        var btnClose = $("#toggle-setting");
        var settingsOpened = $(".settings").hasClass("active");

        if(settingsOpened){
            // if the target of the click is toggle-sidebar button
            if(btnClose.is(e.target) || btnClose.has(e.target).length){
                return;
            }
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $(".settings").removeClass("active");
            }
        }

        var isSmallDevice = ($(document).width()<768);
        var container = $("#sidebar");
        var btnClose = $("#toggle-sidebar");
        var collapsed = $("body").hasClass("sidebar-collapse");
        if(collapsed && isSmallDevice){
            // if the target of the click is toggle-sidebar button
            if(btnClose.is(e.target) || btnClose.has(e.target).length){
                return;
            }
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                btnClose.click();
            }
        }


    });


    // IE detector for jQuery, so we can use $.browser.msie
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();

    
})(jQuery);