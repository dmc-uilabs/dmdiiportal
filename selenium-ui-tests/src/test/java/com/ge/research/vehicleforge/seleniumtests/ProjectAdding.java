package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProjectAdding extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 20);

	//Navigate from MyAccount Menu
	@Test
	public void accountProjectNav() throws Exception{
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("My Projects", driver.getTitle());
	    
	    driver.findElement(By.linkText("Test project")).click();
	    assertEquals("MENU\nHOME", driver.findElement(By.xpath("//md-toolbar/div/div/div")).getText());
	}

	
}
