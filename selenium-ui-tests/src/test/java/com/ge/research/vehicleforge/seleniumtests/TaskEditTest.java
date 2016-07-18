package com.ge.research.vehicleforge.seleniumtests;


import org.junit.*;

import org.openqa.selenium.*;

public class TaskEditTest extends BaseTest {
	
	
	public void testTaskEdit(String taskUrl) throws Exception {
		
		String header = TestUtils.getHeader();  	  
		driver.get(taskUrl);
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.xpath("//div[2]/button")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "task edit");
	    driver.findElement(By.xpath("//md-input-container[2]/textarea")).clear();
	    driver.findElement(By.xpath("//md-input-container[2]/textarea")).sendKeys(header + "detail edit");
	    driver.findElement(By.xpath("//md-datepicker/div/button")).click();
	    driver.findElement(By.xpath("//tbody[4]/tr[3]/td[3]/span")).click();
	    driver.findElement(By.xpath("//md-select-value")).click();
	    driver.findElement(By.xpath("//md-option")).click();
	    driver.findElement(By.xpath("//div[3]/md-input-container/md-select/md-select-value/span[2]")).click();
	    driver.findElement(By.xpath("//md-option[2]")).click();
	    driver.findElement(By.xpath("//button[4]")).click();
	}

	
}
