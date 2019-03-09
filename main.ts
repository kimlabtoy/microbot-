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
        S0 = 0,
        S1 = 1,
        S2 = 2,
        S3 = 3,
        S4 = 4,
        S5 = 5,
        S6 = 6,
        S7 = 7,
        S8 = 8,
        S9 = 9,
        S10 = 10,
        S11 = 11,
        S12 = 12,
        S13 = 13,
        S14 = 14,
        S15 = 15,
        
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
     */
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
    
	/**
     * Used to move the given servo to the specified degrees (0-180) connected to the KSB038
     * @param channel The number (1-16) of the servo to move
     * @param degrees The degrees (0-180) to move the servo to
     * @param servomin 'minimum' pulse length count ; eg: 112
     * @param servomax 'maximum' pulse length count ; eg: 491
     */
    //% blockId=PCA_ServoRange
    //% block="Servo channel %channel|degrees %degree"
    //% degree.min=0 degree.max=180
	export function ServoRange(channel: ServoNum, degree: number): void {
        
        if(!initialized){
			init()
		}
		// 50hz: 20,000 us
        //normal 0.5ms~2.4ms
        //SG90 0.5ms~2.0ms
        // servomin Servo_min_timing (ms)*1000*4096/20000 
        // servomax Servo_max_timing (ms)*1000*4096/20000 
        // let pulselen = servo_map(degree, 0, 180, SERVOMIN, SERVOMAX);
        let pulselen = servo_map(degree, 0, 180, 112, 491);
        
        
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
	
	
	
	
}
