var magnitude = 1;
var positive = true;

$(document).ready(function() {
  //adds canvas, then sets size of that canvas
  //see resizeCanvas function for more info.
  $('#click-field').append('<canvas id="canvas-field"></canvas>');
  resizeCanvas();
});

setMagnitude = function() {
  magnitude = $('#magnitude-box').val();
};

setSign = function(sign) {
  this.positive = sign;
};

resetField = function() {
  ElectricFieldViewer.SourceCharges = [];
  var c = document.getElementById("canvas-field");
  c.width = c.width;
  ElectricFieldViewer.drawField();
};

warn = function() {
  alert("Don't drink and drive.");
};

/*
    The HTML5 canvas is tricky and has to be resized every time
    its container is resized. Setting its width and height to 100%
    (or in this case, 100% and 75% respectively) isn't an option.
  */
resizeCanvas = function() {
  var width = $('#click-field').width();
  var height = $('#click-field').height();
  $('#canvas-field').prop('width', width);
  $('#canvas-field').prop('height', height);
};

$('#click-field').on('click', function(e) {
  var radius = ElectricFieldViewer.circleRadius;
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
  //creating a graphically undesirable effect
  var c = document.getElementById("canvas-field");
  c.width = c.width;
  
  ElectricFieldViewer.drawField();
});

var ElectricFieldViewer = {
  SourceCharges: [],
  /*
    SourceCharge fields (for easy reference):
      - x (x location)
      - y (y location)
      - charge (the charge, including sign)
  */
  circleRadius: 15,
  scale: 4,
  drawLimit: 500,
  step: 10,
  
  testCharge: 1,
  forceFactor: 1000,
  
  
  drawField: function() {
    //the source charges are drawn AFTER the lines are drawn, to make the
    //source charges cover the lines.
    this.drawLines();
    this.drawCharges();
  },
  
  drawCharges() {
    var c = document.getElementById("canvas-field");
    var ctx = c.getContext("2d");
    ctx.font = "16px sans-serif";
    
    for (var k = 0; k < this.SourceCharges.length; k++) {
      var x = this.SourceCharges[k].x;
      var y = this.SourceCharges[k].y;
      ctx.beginPath();
      ctx.arc(x,y,15,0,2*Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
      
      //constructs and displays the string (ex. '+2') displayed inside the source charge
      var chargeText = "";
      if (this.SourceCharges[k].charge > 0) chargeText += "+";
      chargeText += this.SourceCharges[k].charge;
      ctx.fillStyle = 'black';
      ctx.fillText(chargeText,x-10,y+8);
    }
  },
  
  drawLines: function() {
    var canvas = document.getElementById('canvas-field');
    var ctx = canvas.getContext('2d');
    
    for (var i = 0; i < this.SourceCharges.length; i++) {
      if (this.SourceCharges[i].charge > 0) {
        var startAngle, preX, preY, nextX, nextY, nextAngle;
        var scaleToUse = this.scale * Math.abs(this.SourceCharges[i].charge);
        for (var j = 0; j < scaleToUse; j++) {
          startAngle = 2 * Math.PI / scaleToUse * j;
          preX = this.SourceCharges[i].x + this.circleRadius * Math.cos(startAngle);
          preY = this.SourceCharges[i].y + this.circleRadius * Math.sin(startAngle);
          for (var k = 0; k < this.drawLimit; k++) {
            var netX = 0;
            var netY = 0;
            
            var dis, mag, angle;
            
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
            
            preX = nextX;
            preY = nextY;
          }
        }
      }
    }
  },
  
  
};

