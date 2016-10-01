var magnitude;
var positive = true;
var aboutPageOn = false;

$(document).ready(function() {
  //adds canvas, then sets size of that canvas (see resizeCanvas function for more info.)
  //adds an invisible hover box with no text, awaiting mouseovers.
  addCanvas();
  addHoverBox();
});

addCanvas = function() {
  $('#click-field').append('<canvas id="canvas-field"></canvas>');
  resizeCanvas();
}

/*
  below are a bunch of functions watching for hover events (how I'm
  getting mouseover texttips to work.) I really want to put these into
  a handlers object or something, but then .hover won't work.
*/
$('#magnitude-box').hover(function() {
  showHoverBox('Sets the source charge magnitude');
}, function() {
  hideHoverBox();
});
$('#positive-radio').hover(function() {
  showHoverBox('Sets the source charge to be positive');
}, function() {
  hideHoverBox();
});
$('#negative-radio').hover(function() {
  showHoverBox('Sets the source charge to be negative');
}, function() {
  hideHoverBox();
});
$('#scale-box').hover(function() {
  showHoverBox('Sets the the number of field lines for a source charge of magnitude 1');
}, function() {
  hideHoverBox();
});
$('#step-box').hover(function() {
  showHoverBox('Sets the step (resolution) of the field lines. Caps at 30. NOTE: HIGHER step = LOWER resolution');
}, function() {
  hideHoverBox();
});
$('#drawLimit-box').hover(function() {
  showHoverBox('Sets the maximum length (in pixels) of a field line. NOTE: do NOT set less than step');
}, function() {
  hideHoverBox();
});
$('#defaults-button').hover(function() {
  showHoverBox('Restores magnitude, sign, scale, step, and draw limit to their default values');
}, function() {
  hideHoverBox();
});
$('#about-button').hover(function() {
  showHoverBox('Click for about page');
}, function() {
  hideHoverBox();
});

$('#refresh-button').hover(function() {
  showHoverBox('Refreshes, but does not clear, the electric field');
}, function() {
  hideHoverBox();
});

$('#clear-button').hover(function() {
  showHoverBox('Erases the electric field');
}, function() {
  hideHoverBox();
});
$('#warning-button').hover(function() {
  showHoverBox('Stay safe, kids.');
}, function() {
  hideHoverBox();
});

/*
  When the webpage loads, an empty, transparent hover box is created,
  ready to be modified by showHoverBox(txt) and hideHoverBox.
*/
addHoverBox = function() {
  //get height of hoverBox's container
  var field = $('#click-field');
  var height = field.height() - 32;
  
  var hoverBox = $("<div>     </div>");
  hoverBox.css('position','absolute');
  hoverBox.css('top',height + "px");
  hoverBox.css('left','2px');
  hoverBox.css('z-index','1');
  hoverBox.css('border-radius','3px');
  hoverBox.css('padding','5px 8px');
  hoverBox.css('font-family','"Roboto Slab", Verdana, sans-serif');
  hoverBox.css('color','rgb(255,255,255)');
  hoverBox.attr('id','hover-box');
  
  field.append(hoverBox);
};

//makes the already created hover box (from addHoverBox()) opaque and gives it text
showHoverBox = function(txt) {
  //gets height of hoverBox's container again, in case resizing happened
  var field = $('#click-field');
  var height = field.height() - 32;
  
  $('#hover-box').css('top',height + "px");
  $('#hover-box').css('background-color','rgba(51, 122, 183, .8)');
  $('#hover-box').text(txt);
};

//makes the already created hover box (from addHoverBox()) transparent and removes the text
hideHoverBox = function() {
  $('#hover-box').css('background-color','rgba(51, 122, 183, 0)');
  $('#hover-box').text("");
};

setSign = function(sign) {
  this.positive = sign;
};

//restores magnitude, scale, step, drawLimit, and sign to their default values
restoreDefaults = function() {
  $('#magnitude-box').val("1");
  $('#scale-box').val("4");
  $('#step-box').val("10");
  $('#drawLimit-box').val("2000");
  $("#positive-radio").prop("checked", true);
  positive = true;
};

//removes Canvas and displays "About" information. A back button is added
displayAbout = function() {
  if (aboutPageOn === true) {
    //do nothing
  }
  else {
    var title = $('<h1>Electric Field Simulator</h1>');
    title.css('margin-top', '30px');
    title.css('color', 'rgb(0,0,120)');
    
    var subtitle = $('<h3>v2.0</h3>');
    subtitle.css('margin-top', '-3px');
    subtitle.css('color', 'rgb(51,122,255)');
    
    var information = $('' +
    '<p>A web application for simulating electric fields around source charges.<br>' +
    'Inspired by a Physics: E&M class (thanks Dr. Desipio) and a smart friend.</p>'
    + '');
    information.css('margin-top','20px');
    information.css('font-size','20px');
    
    var inspiration = $('' +
    '<p>Created by Michael Fan (github: <a href="https://github.com/michaelyfan">michaelyfan</a>)<br>' +
    'Inspired by the original Java version by Orion Forowycz (github: <a href="https://github.com/Orion-F">Orion-F</a>)</p>');
    inspiration.css('margin-top','20px');
    
    var button = $('<button class="btn btn-primary" onclick="goBackFromAbout()">Back</button>');
    button.css('margin-top','30px');
    button.css('font-size','30px');
    
    var aboutContainer = $('<div id="info-container"></div>');
    aboutContainer.append(title);
    aboutContainer.append(subtitle);
    aboutContainer.append(information);
    aboutContainer.append(inspiration);
    aboutContainer.append(button);
    aboutContainer.css('text-align','center');
    aboutContainer.css('font-family',"'Roboto Slab', Verdana, sans-serif");
    aboutContainer.prop('id','about-container');
  
    $('#canvas-field').remove();
    
    aboutContainer.hide().appendTo($('#click-field')).fadeIn('fast');
    $('#click-field').append(aboutContainer);
    
    aboutPageOn = true;
  }
  
};

/*
  The back button on the info page.
*/
goBackFromAbout = function() {
  
  $('#about-container').fadeOut('fast').remove();
  addCanvas();
  ElectricFieldViewer.drawField();
  
  setTimeout(function() {
    aboutPageOn = false;
  },300);
};

refreshField = function() {
  var c = document.getElementById("canvas-field");
  c.width = c.width;
  getUserInputs();
  ElectricFieldViewer.drawField();
}

//erases the field and empties out ElectricFieldViewer.SourceCharges
clearField = function() {
  ElectricFieldViewer.SourceCharges = [];
  var c = document.getElementById("canvas-field");
  c.width = c.width;
  ElectricFieldViewer.drawField();
};

//10,000 people were killed in drunk-driving related incidents in 2015. 
warn = function() {
  alert("Don't drink and drive.");
};

/*
    The HTML5 canvas is tricky and has to be resized every time
    its container is resized. Setting its width and height to 100%
    (or in this case, 100% and 70% respectively) isn't an option.
  */
resizeCanvas = function() {
  var width = $('#click-field').width();
  var height = $('#click-field').height();
  $('#canvas-field').prop('width', width);
  $('#canvas-field').prop('height', height);
};

//sets user inputs for magnitude, scale, step, and drawLimit, to ElectricFieldViewer's fields
getUserInputs = function() {
  magnitude = $('#magnitude-box').val();
  ElectricFieldViewer.scale = $('#scale-box').val();
  ElectricFieldViewer.drawLimit = $('#drawLimit-box').val();
  
  if ($('#step-box').val() <= 30) {
    ElectricFieldViewer.step = $('#step-box').val();
  }
  else {
    ElectricFieldViewer.step = 30;
    $('#step-box').val("30");
  }
};

/*
  on click:
    -sets user inputs (magnitude, step, drawLimit, and scale)
    -creates a new SourceCharge at the mouse position, and inserts into ElectricFieldViewer's array
    -resets the canvas. (see notes below)
    -calls ElectricFieldViewer.drawField
*/
$('#click-field').on('click', function(e) {
  if (aboutPageOn === false) {
    getUserInputs();
    var x = e.pageX;
    var y = e.pageY;
    
    var ch;
    if (positive === true) ch = magnitude;
    else ch = -magnitude;
    
    //adds a SourceCharge with x-loc,y-loc,and charge (not just magnitude)
    ElectricFieldViewer.SourceCharges.push({
      x:x,
      y:y,
      charge: ch
    });
    
    //clears the canvas. If I don't do this, circles draw over themselves,
    //creating graphically undesirable thick lines
    var c = document.getElementById("canvas-field");
    c.width = c.width;
    
    ElectricFieldViewer.drawField();
  }
  
});


var ElectricFieldViewer = {
  SourceCharges: [],
  /*
    SourceCharge fields (for easy reference):
      - x (x location)
      - y (y location)
      - charge (the charge, including sign)
  */
  chargeRadius: 15,
  scale: 4,
  drawLimit: 2000,
  step: 10,
  notReachedNegative: true,
  
  testCharge: 1,
  forceFactor: 1000,
  
  
  drawField: function() {
    //the source charges are drawn AFTER the lines are drawn, to make the
    //source charges cover the lines.
    var c = document.getElementById("canvas-field");
    var context = c.getContext("2d");
    
    this.drawLines(context);
    this.drawCharges(context);
  },
  
  drawCharges: function(ctx) {
    
    ctx.font = "16px sans-serif";
    
    for (var k = 0; k < this.SourceCharges.length; k++) {
      var x = this.SourceCharges[k].x;
      var y = this.SourceCharges[k].y;
      ctx.beginPath();
      ctx.arc(x,y,this.chargeRadius,0,2*Math.PI);
      
      var textStyle;
      //gives the SourceCharge color
      if (this.SourceCharges[k].charge < 0) { //charge is negative
        ctx.fillStyle = 'rgb(92, 92, 214)';
        textStyle = 'white';
      }
      else if (this.SourceCharges[k].charge > 0) { //charge is positive
        ctx.fillStyle = 'rgb(255, 77, 77)';
        textStyle = 'white';
      }
      else { //charge is zero
        ctx.fillStyle = 'white';
        textStyle = 'black';
      }
      ctx.fill();
      ctx.stroke();
      
      //constructs and displays the string (ex. '+2') displayed inside the source charge
      var chargeText = "";
      if (this.SourceCharges[k].charge > 0) chargeText += "+";
      chargeText += this.SourceCharges[k].charge;
      ctx.fillStyle = textStyle;
      ctx.font = '18px "Roboto Slab"';
      ctx.fillText(chargeText,x-10,y+8);
    }
  },
  
  drawLines: function(ctx) {
    for (var i = 0; i < this.SourceCharges.length; i++) {
      if (this.SourceCharges[i].charge > 0) {
        var startAngle, preX, preY, nextX, nextY, nextAngle;
        var scaleToUse = this.scale * Math.abs(this.SourceCharges[i].charge);
        
        for (var j = 0; j < scaleToUse; j++) {
          this.notReachedNegative = true;
          startAngle = 2 * Math.PI / scaleToUse * j;
          preX = this.SourceCharges[i].x + this.chargeRadius * Math.cos(startAngle);
          preY = this.SourceCharges[i].y + this.chargeRadius * Math.sin(startAngle);
          
          for (var k = 0;  this.notReachedNegative && k < this.drawLimit/this.step; k++) {
            var netX = 0;
            var netY = 0;
            
            var dis, mag, angle;
            
            /*
              Sums the x and y forces from all source charges
            */
            for (var l = 0;l < this.SourceCharges.length; l++) {
              dis = Math.hypot(preX-this.SourceCharges[l].x,preY-this.SourceCharges[l].y);
              mag = this.forceFactor * this.SourceCharges[l].charge / dis / dis;
              angle = Math.atan2(preY - this.SourceCharges[l].y, preX - this.SourceCharges[l].x);
              netX += mag * Math.cos(angle);
              netY += mag * Math.sin(angle);
              
            }
            
            nextAngle = Math.atan2(netY, netX);
            
            nextX = preX + this.step*Math.cos(nextAngle);
            nextY = preY + this.step*Math.sin(nextAngle);
            ctx.beginPath();
            ctx.moveTo(preX,preY);
            ctx.lineTo(nextX,nextY);
            ctx.stroke();
            if (this.reachedNegative(nextX, nextY) === true) {
              this.notReachedNegative = false;
            }
            else {
              preX = nextX;
              preY = nextY; 
            }
          }
        }
      }
    }
  },
  
  reachedNegative: function(x,y) {
    var reached = false;
    for (var k = 0; k < this.SourceCharges.length; k++) {
      
      if(this.SourceCharges[k].charge < 0 && !reached) {
        var negX = this.SourceCharges[k].x;
        var negY = this.SourceCharges[k].y;
        dis = Math.hypot(x-negX, y-negY);
        //console.log(dis <= this.chargeRadius);
        if (dis <= this.chargeRadius) {
          reached = true;
        }
      }
    }
    return reached;
  },
  
  
};



