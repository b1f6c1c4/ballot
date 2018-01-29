import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'animate.css/animate.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'typeface-montserrat/index.css';
import 'ionicons/css/ionicons.min.css';

import jQuery from 'jquery';
import { WOW } from 'wowjs';
import 'jquery.easing';
import 'superfish';
import 'superfish/dist/js/hoverIntent';
import './style.css';

/* eslint-disable func-names */

jQuery(document).ready(($) => {
  // Header fixed and Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
      $('#header').addClass('header-fixed');
    } else {
      $('.back-to-top').fadeOut('slow');
      $('#header').removeClass('header-fixed');
    }
  });
  $('.back-to-top').click(() => {
    $('html, body').animate({
      scrollTop: 0,
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show',
    },
    speed: 400,
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    const mobileNav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav',
    });
    mobileNav.find('> ul').attr({
      class: '',
      id: '',
    });
    $('body').append(mobileNav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children > a', function () {
      $(this).toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).prev().toggleClass('fa-chevron-up fa-chevron-down');
    });

    $(document).on('click', '.menu-has-children i', function () {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass('fa-chevron-up fa-chevron-down');
    });

    $(document).on('click', '#mobile-nav-toggle', () => {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click((e) => {
      const container = $('#mobile-nav, #mobile-nav-toggle');
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($('#mobile-nav, #mobile-nav-toggle').length) {
    $('#mobile-nav, #mobile-nav-toggle').hide();
  }

  // Smoth scroll on page hash links
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
    if (!this.hash) return undefined;

    const target = $(this.hash);
    if (target.length) return undefined;

    let topSpace = 0;

    if ($('#header').length) {
      topSpace = $('#header').outerHeight();

      if (!$('#header').hasClass('header-fixed')) {
        topSpace -= 20;
      }
    }

    $('html, body').animate({
      scrollTop: target.offset().top - topSpace,
    }, 1500, 'easeInOutExpo');

    if ($(this).parents('.nav-menu').length) {
      $('.nav-menu .menu-active').removeClass('menu-active');
      $(this).closest('li').addClass('menu-active');
    }

    if ($('body').hasClass('mobile-nav-active')) {
      $('body').removeClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').fadeOut();
    }

    return false;
  });
});
