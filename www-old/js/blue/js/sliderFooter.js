jQuery(function($) {
		var open = false;
		$('#footerSlideButton').click(function () {
			alert("this is text");
			if(open === false) {
				$('#footerSlideContent').animate({ height: '166px' });
				$(this).css('backgroundPosition', 'bottom left');
				open = true;
			} else {
				$('#footerSlideContent').animate({ height: '0px' });
				$(this).css('backgroundPosition', 'top left');
				open = false;
			}
		});		
});