package com.ge.research.vehicleforge.seleniumtests;


import org.junit.*;

import org.openqa.selenium.*;


public class NewTaskFromProjectTest extends BaseTest {
	
	
	public String testNewTaskFromProject(String projectHome) throws Exception {
		
		String header = TestUtils.getHeader();  
		
		
		driver.get(projectHome);
		driver.findElement(By.xpath("//html/body/div[2]/ui-view/div[2]/div/div[1]/div[3]/div[1]/md-toolbar/div/a[1]/ng-md-icon/svg")).click();
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "test description");
	    driver.findElement(By.xpath("//md-input-container[3]/textarea")).clear();
	    driver.findElement(By.xpath("//md-input-container[3]/textarea")).sendKeys(header + "test details");
	    driver.findElement(By.xpath("//md-datepicker/button")).click();
	    driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//body/div[3]")).click();
	    driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//tbody[4]/tr[3]/td[3]/span")).click();
	    driver.findElement(By.xpath("//div[2]/md-input-container/md-select")).click();
	    driver.findElement(By.xpath("//md-option[4]")).click();
	    driver.findElement(By.xpath("//div[3]/md-input-container/md-select")).click();
	    driver.findElement(By.xpath("//md-option")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    
	    return driver.getCurrentUrl();
	}

	
}
