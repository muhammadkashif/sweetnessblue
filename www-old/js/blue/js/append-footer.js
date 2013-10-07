$(document).ready(function() {
		//alert('asdsa');
		$footer_GROUP = $('#footer_GROUP').parent().html();
		if($('#footer_GROUP').parent().attr('id') == 'mybody'){		
		} else {
			$('#footer_GROUP').html('');
			$('#mybody').append($footer_GROUP);	
		}	
		
});
