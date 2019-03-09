//% weight=0 color=#3CB371 icon="\uf544" block="KimlabRobot"
namespace KimlabRobot {
    /**
    * 計算長方形面積，並回傳
    */
	
	/*
    //% blockId="areaOfRectangle" block="area of rectangle length %length|width %width"
    //% blockGap=2 weight=0 blockExternalInputs=true
    export function areaOfRectangle(length: number, width:number): number {
        return length*width
    }
	*/
    /**
    * 計算長方形面積，不回傳，只顯示在LED
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
}
