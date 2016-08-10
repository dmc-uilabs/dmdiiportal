package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.util.logging.Level;

import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectFromAccountProjectTest extends BaseTest {
	WebDriverWait wait = new WebDriverWait(driver, 30);
	JavascriptExecutor jse = (JavascriptExecutor) driver;

	// Navigate from MyAccount Menu
	@Ignore
	@Test
	public void accountProjectNav() throws Exception {
		Thread.sleep(3000);
		driver.findElement(By.xpath("html/body/div[1]/header/div[1]/div/div/div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
		element.click();
		log.log(Level.INFO, "Get current title:" + driver.getTitle());
		assertEquals("My Projects", driver.getTitle());
		
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		
		AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
	    addProject.addProjectFunctionalityTest();
	}


}