package com.ge.research.vehicleforge.seleniumtests;

import org.openqa.selenium.*;

public class DeleteTaskTest extends BaseTest {
	public void testDeleteTask(String toBeDeleted) throws Exception {

		String header = TestUtils.getHeader();
		driver.get(toBeDeleted);
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.id("input_6")).sendKeys(header + "testing delete functionality");
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "for selenium");
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.cssSelector("#md-0-2016-6-1 > span.md-calendar-date-selection-indicator")).click();
		driver.findElement(By.id("select_10")).click();
		driver.findElement(By.id("select_option_13")).click();
		driver.findElement(By.id("select_12")).click();
		driver.findElement(By.cssSelector("#select_option_28 > div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//md-dialog/div/button[2]")).click();
	}

}
