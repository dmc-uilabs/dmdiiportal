package com.ge.research.vehicleforge.seleniumtests;


import org.junit.*;

import org.openqa.selenium.*;

public class NewTaskFromTasksPageTest extends BaseTest{

	@Ignore
	@Test
	public void testNewTaskFromTasksPage() throws Exception {
		
		String header = TestUtils.getHeader();  
		driver.get(baseUrl + "/project.php#/3/tasks");
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.xpath("/html/body/div[2]/ui-view/div[1]/md-toolbar/div/div/div/a/ng-md-icon/svg")).click();
		driver.findElement(By.id("input_6")).sendKeys(header + "Selenium Task Test");
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "testing new task from tasks list for Selenium");
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.cssSelector("#md-0-2016-5-28 > span.md-calendar-date-selection-indicator")).click();
		driver.findElement(By.id("select_10")).click();
		driver.findElement(By.id("select_option_16")).click();
		driver.findElement(By.id("select_12")).click();
		driver.findElement(By.cssSelector("#select_option_29 > div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[2]")).click();
	}

	
}
