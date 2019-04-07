//% weight=0 color=#000000 icon="\uf11a" block="KimlabRobot"
namespace KimlabRobot {
   
	
	/*回傳值
    //% blockId="areaOfRectangle" block="area of rectangle length %length|width %width"
    //% blockGap=2 weight=0 blockExternalInputs=true
    export function areaOfRectangle(length: number, width:number): number {
        return length*width
    }
	*/
    /**
    * 不回傳值
    */
    //% blockId="LedTest" block="Smile"
    //% blockGap=2 weight=1
    export function LedTest(): void {
        basic.showLeds(`
    . # . # .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `)
    }
	
	
    const SERVOMIN = 112 // this is the 'minimum' pulse length count (out of 4096)
    const SERVOMAX = 491 // this is the 'maximum' pulse length count (out of 4096)
    const IIC_ADDRESS = 0x40
    const MODE1 = 0x00
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06
    
    export enum ServoNum {
        S1 = 0,
        S2 = 1,
        S3 = 2,
        S4 = 3,
        S5 = 4,
        S6 = 5,
        S7 = 6,
        S8 = 7,
        S9 = 8,
        S10 = 9,
        S11 = 10,
        S12 = 11,
        S13 = 12,
        S14 = 13,
        S15 = 14,
        S16 = 15,
        
    }



    let initialized = false
	
    function i2c_write(reg: number, value: number) {
        
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(IIC_ADDRESS, buf)
    }

    function i2c_read(reg: number){
        
        pins.i2cWriteNumber(IIC_ADDRESS, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(IIC_ADDRESS, NumberFormat.UInt8BE);
        return val;
    }

    function init(): void {
		i2c_write(MODE1, 0x00)
        let freq=50;
        // Constrain the frequency
        let prescaleval = 25000000/4096/freq;
        prescaleval -= 1;
        let prescale = prescaleval; 
        //let prescale = 121;
        let oldmode = i2c_read(MODE1);        
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2c_write(MODE1, newmode); // go to sleep
        i2c_write(PRESCALE, prescale); // set the prescaler
        i2c_write(MODE1, oldmode);
        control.waitMicros(5000);
        i2c_write(MODE1, oldmode | 0xa0);
        initialized = true
    }
	function servo_map(x: number, in_min: number, in_max: number, out_min: number, out_max: number)
    {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
	
    /**
     * Used to move the given servo to the specified degrees (0-180) connected to the KSB038
     * @param channel The number (1-16) of the servo to move
     * @param degrees The degrees (0-180) to move the servo to 
     **/
     //% blockId=PCA_Servo
     //% block="Servo channel %channel|degrees %degree"
     //% degree.min=0 degree.max=180
	 
	export function Servo(channel: ServoNum, degree: number): void {
        
        if(!initialized){
			init()
		}
		// 50hz: 20,000 us
        //let servo_timing = (degree*1800/180+600) // 0.55 ~ 2.4
        //let pulselen = servo_timing*4096/20000
        //normal 0.5ms~2.4ms
        //SG90 0.5ms~2.0ms

        let pulselen = servo_map(degree, 0, 180, 112, 491);
        //let pulselen = servo_map(degree, 0, 180, servomin, servomax);
        
        
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = 0;
        buf[2] = (0>>8);
        buf[3] = pulselen & 0xff;
        buf[4] = (pulselen>>8) & 0xff;
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
    }
	
	//% blockId=OTTO_Servo
    //% block="OTTO_RHAND %RHAND| OTTO_LHAND %LHAND| OTTO_RLEG %RLEG| OTTO_LLEG %LLEG| OTTO_RFOOT %RFOOT| OTTO_LFOOT %LFOOT "
    //% RHAND.min=0 RHAND.max=180 LHAND.min=0 LHAND.max=180 RLEG.min=0 RLEG.max=180 LLEG.min=0 LLEG.max=180 RFOOT.min=0 RFOOT.max=180 LFOOT.min=0 LFOOT.max=180
	export function OTTO_Servo(RHAND: number,LHAND: number,RLEG: number,LLEG: number,RFOT: number,LFOOT: number): void {
        KimlabRobot.Servo(KimlabRobot.ServoNum.S2,RHAND)
		KimlabRobot.Servo(KimlabRobot.ServoNum.S3,RLEG)
		KimlabRobot.Servo(KimlabRobot.ServoNum.S4,RFOOT)
		KimlabRobot.Servo(KimlabRobot.ServoNum.S15,LHAND)
		KimlabRobot.Servo(KimlabRobot.ServoNum.S14,LLEG)
		KimlabRobot.Servo(KimlabRobot.ServoNum.S13,LFOOT)
		
        
    }
	
    
}
