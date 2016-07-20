package com.ge.research.vehicleforge.seleniumtests;


import org.junit.*;

import org.openqa.selenium.*;

public class NewTaskFromTasksPageTest extends BaseTest{

	
	public String testNewTaskFromTasksPage(String tasksHome) throws Exception {
		
		String header = TestUtils.getHeader();  
		driver.get(tasksHome);
		driver.findElement(By.xpath("/html/body/div[2]/ui-view/div[1]/md-toolbar/div/div/div/a/ng-md-icon/svg")).click();
		
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "test description");
	    driver.findElement(By.xpath("//md-input-container[3]/textarea")).clear();
	    driver.findElement(By.xpath("//md-input-container[3]/textarea")).sendKeys(header + "test details");
	    driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//tbody[4]/tr[3]/td[3]/span")).click();
	    driver.findElement(By.xpath("//div[2]/md-input-container/md-select")).click();
	    driver.findElement(By.xpath("//md-option[3]")).click();
	    driver.findElement(By.xpath("//div[3]/md-input-container/md-select")).click();
	    driver.findElement(By.xpath("//md-option[2]/div")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    
	    return driver.getCurrentUrl();
	}

	
}
