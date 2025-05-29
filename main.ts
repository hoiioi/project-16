function gas_mode () {
    if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        soundExpression.twinkle.playUntilDone()
    } else {
        music.stopAllSounds()
    }
}
function auto_LED () {
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
}
input.onButtonPressed(Button.A, function () {
    passwd_enter = "" + passwd_enter + "."
    serial.writeString(passwd_enter)
    serial.writeLine("")
    I2C_LCD1602.ShowString(passwd_enter, 0, 1)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    for (let index = 0; index < 1; index++) {
        I2C_LCD1602.clear()
    }
    I2C_LCD1602.ShowString("Close the door", 0, 0)
    pins.servoWritePin(AnalogPin.P8, 0)
    basic.pause(1000)
    passwd_enter = ""
    for (let index = 0; index < 1; index++) {
        I2C_LCD1602.clear()
    }
    I2C_LCD1602.ShowString("Enter password", 0, 0)
    strip.clear()
    strip.show()
})
input.onButtonPressed(Button.AB, function () {
    I2C_LCD1602.clear()
    if (passwd_enter == password) {
        basic.showIcon(IconNames.Duck)
        I2C_LCD1602.ShowString("Successful", 0, 0)
        I2C_LCD1602.ShowString("Open the door", 0, 1)
        pins.servoWritePin(AnalogPin.P8, 180)
        strip.setBrightness(100)
        strip.showColor(neopixel.colors(NeoPixelColors.Purple))
        strip.show()
    } else {
        I2C_LCD1602.ShowString("Enter again", 0, 0)
        I2C_LCD1602.ShowString("Error", 0, 1)
        passwd_enter = ""
        basic.pause(1000)
        I2C_LCD1602.clear()
        I2C_LCD1602.ShowString("Enter password", 0, 0)
    }
})
function AutoMode () {
    auto_window()
    auto_LED()
    gas_mode()
    temperature_fans()
}
input.onButtonPressed(Button.B, function () {
    passwd_enter = "" + passwd_enter + "-"
    serial.writeString(passwd_enter)
    serial.writeLine("")
    I2C_LCD1602.ShowString(passwd_enter, 0, 1)
})
function auto_window () {
    water_val = pins.analogReadPin(AnalogReadWritePin.P0)
    if (water_val > 300) {
        pins.servoWritePin(AnalogPin.P9, 0)
    } else {
        pins.servoWritePin(AnalogPin.P9, 100)
    }
}
function temperature_fans () {
    temprature_val = input.temperature()
    serial.writeNumber(temprature_val)
    serial.writeLine("")
    if (temprature_val >= 35) {
        pins.analogWritePin(AnalogPin.P12, 500)
        pins.analogWritePin(AnalogPin.P13, 1023)
    } else {
        pins.analogWritePin(AnalogPin.P12, 0)
        pins.analogWritePin(AnalogPin.P13, 0)
    }
}
let temprature_val = 0
let water_val = 0
let strip: neopixel.Strip = null
let passwd_enter = ""
let password = ""
serial.redirectToUSB()
basic.showIcon(IconNames.House)
pins.servoWritePin(AnalogPin.P9, 100)
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.clear()
basic.pause(100)
I2C_LCD1602.ShowString("Enter password", 0, 0)
pins.digitalWritePin(DigitalPin.P16, 0)
password = "..--"
passwd_enter = ""
strip = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
strip.clear()
strip.show()
basic.forever(function () {
    AutoMode()
})
