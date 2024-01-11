class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.offset = offset
    this.isMirrored = false; 
  }

  draw() {
    c.drawImage(
      this.image, 
      this.framesCurrent * (this.image.width / this.framesMax),
      0,

      //crop the image by how many frames
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y, 
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale)
  }

  animateFrames() {
    this.framesElapsed++
    //slows down the animation
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
      this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({ 
    position,
    velocity,
    color = "red", 
    imageSrc, scale = 1, 
    framesMax = 1, 
    offset = {x: 0, y: 0},
    sprites
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }


  update() {
    this.draw();
    this.animateFrames()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //to stop our sprites from falling downwards out the canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite('attack')
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1)

      return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          player.framesMax = player.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          player.image = player.sprites.run.image
          player.framesMax = player.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          player.image = player.sprites.jump.image
          player.framesMax = player.sprites.jump.framesMax
          this.framesCurrent = 0
        break;
        }
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          player.image = player.sprites.fall.image
          player.framesMax = player.sprites.fall.framesMax
          this.framesCurrent = 0
        break;
        }
      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          player.image = player.sprites.attack.image
          player.framesMax = player.sprites.attack.framesMax
          this.framesCurrent = 0
        break;
        }
    }
  }
}