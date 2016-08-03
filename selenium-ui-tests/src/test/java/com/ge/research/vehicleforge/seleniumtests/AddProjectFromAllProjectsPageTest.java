package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectFromAllProjectsPageTest extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 30);
	JavascriptExecutor jse = (JavascriptExecutor) driver;
	
	@Test
	public void addProjectFromAllProjectsPageTest() throws Exception{
		 //Test Projects -> All Projects
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    //wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.linkText("All Projects"))).click();
	    assertEquals("All Projects", driver.getTitle());
		
	    
	    driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		
	    AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
	    addProject.addProjectFunctionalityTest();
	    
	}

}
