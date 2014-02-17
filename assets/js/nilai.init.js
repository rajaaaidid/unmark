/*!
    Action Scripts for Nilai.co
    Copyright 2014 - Plain - http://plainmade.com

    A set of functions used to show interactions throughout Nilai.

    Also includes the INIT file.

*/

(function ($) { 

    // Main Init Script
    nilai.init = function () {

        // Define some re-usable elements 
        this.nav_panel = $('.navigation-pane'), 
        this.main_panel = $('.main-wrapper'),
        this.main_content = $('.main-content'),
        this.sidebar_content = $('.sidebar-content'),
        this.main_panel_width = nilai.main_panel.width(),
        this.sidebar_default = $('.sidebar-default'),
        this.sidebar_mark_info = $('.sidebar-mark-info'),
        this.body_height = $(window).outerHeight(true),
        this.special_chars     = { '\\+': '&#43;' };
        this.mainpanels = $('#nilai-wrapper');

        // Basic Page Setup
        nilai.main_panel.width(nilai.main_panel_width);
        nilai.page_setup(nilai.body_height);

        // Resize Helper for Dev Tools 
        // Also for weirdo's who want to resize their browser
        $(window).on('resize',function () {
            nilai.page_setup($(window).outerHeight(true));
        });

        // Set any window variables
        window.nilai_current_page = 1;

        // Animate the body fading in
        $('body').animate({opacity: 1}, 1000);

        // Vertical Tabs
        // Shows and Tabs the Vertical navigition inside the Navigation Panel
        $('.navigation-content a, .navigation-pane-links a').on('click', function (e) {
            nilai.interact_nav(e, $(this));
        });

        // Update Mark Btns
        nilai.update_mark_action_btns();

        // Hover Action on Marks List
        // Shows the Archive and More Buttons
        $(document).on('mouseenter', '.mark', function () {
            $(this).addClass('hide-dot');
            $(this).find('.mark-actions').show();
        });
        $(document).on('mouseleave', '.mark', function () {
            $(this).removeClass('hide-dot');
            $(this).find('.mark-actions').hide();
        });

        // Global Buton / Action Link Run
        // Create a Function from a string
        $(document).on('click', 'button[data-action], .action', function (e) {
            e.preventDefault();
            var action = $(this).data('action'), funct; // Get Data Action Attribute
            funct = eval('nilai.' + action); // Convert it to an executable function
            funct($(this)); // Run it with passed in object
            nilai.hideNavigation(); // Hide Main Navigation
        });

        // Slide Toggle the Sidebar Info Blocks
        $(document).on('click', '.sidebar-info-panel h4.prev-coll', function (e) {
            e.preventDefault();
            var section = $(this).next('section'), arrow = $(this).find('i');
            if (section.is(':visible')) {
                arrow.removeClass('barley-icon-chevron-up');
                arrow.addClass('barley-icon-chevron-down');
                section.slideUp();
            } else {
                arrow.removeClass('barley-icon-chevron-down');
                arrow.addClass('barley-icon-chevron-up');
                section.slideDown();                
            }
        });

        // Click / Tap on a Mark opens the more info and shows the buttons
        $(document).on('click', '.mark', function (e){
            var node = e.target.nodeName, more_link = $(this).find('a.mark-info');
            if (node !== "A" && node !== "I") {
                e.preventDefault();
                more_link.trigger('click');
            }
            nilai.hideNavigation(); // Hide Main Navigation
        });

        // Watch for internal link click and run PJAX
        // To Do, remove outside links from elem array
        if ( $('#nilai').length > 0 ) {
            $(document).pjax("a[href*='/']", nilai.main_content);
            $(document).on('submit', '#search-form', function(e) {
                $.pjax.submit(e, nilai.main_content);
            });
            $(document).on('pjax:complete', function() {
                window.nilai_current_page = 1;
                nilai.main_content.scrollTop(0);
                nilai.main_content.find('.marks').hide().fadeIn();
                nilai.updateDom();
            });
        }

        // Change Password & Email Submit
        $('#passwordUpdate').on('submit', function (e) {
            e.preventDefault();
            nilai.send_password_change($(this));
        });
        $('#emailUpdate').on('submit', function (e) {
            e.preventDefault();
            nilai.send_email_change($(this));
        });
        $('#helperforms input.field-input').on('keydown change', function () {
            $(this).parent().parent().find('.response-message').hide();
        });

        // Close Overlay
        $(document).on('click', '#nilaiModalClose', function (e) { 
            e.preventDefault(); 
            return nilai.overlay(false); 
        });

        // Show Labels in Bookmarklet
        /*$(document).on('mouseenter', '#bml-show-labels', function (e) {
            nilai.marks_addLabel($(this));
        });*/


        // Label Hovers
        $(document).on('mouseenter', '.label-choices li', function (e) {
            var label = $(this),
                label_name = label.find('span').text(),
                label_class = label.attr('class');
            $('#label-chosen').show().text(label_name).removeClass().addClass(label_class);
        });
        $(document).on('mouseleave', '.label-choices li', function (e) {
            $('#label-chosen').show().hide();
        });


        // Set up Scrolling
        nilai.main_content.on('scroll', function (e){
            nilai.scrollPaginate($(this));
        });
        
    };

    // Get this baby in action
    $(document).ready(function(){ nilai.init(); });

}(window.jQuery));