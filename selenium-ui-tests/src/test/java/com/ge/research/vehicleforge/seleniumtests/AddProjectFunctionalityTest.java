package com.ge.research.vehicleforge.seleniumtests;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectFunctionalityTest extends BaseTest {
	
	WebDriverWait wait = new WebDriverWait(driver, 30);
	JavascriptExecutor jse = (JavascriptExecutor) driver;
	
	public String addProjectFunctionalityTest() throws Exception {
		// TODO Auto-generated constructor stub
		WebElement e = wait.until(
				ExpectedConditions.visibilityOfElementLocated(By.xpath("//md-content/form/md-input-container/input")));
		e.clear();
		e.sendKeys(TestUtils.projectName);

		// select due date
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//md-datepicker/button")).click();

		String[] currentDate = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date()).split("-");
		String regex = "^0*";
		currentDate[1] = currentDate[1].matches(regex) ? currentDate[1].substring(1) : currentDate[1];
		String substitutedDate = currentDate[0] + "-" + currentDate[1] + "-" + currentDate[2];
		log.log(Level.INFO, "addProjectTest, xpath is " + "//td[@id='md-0-" + substitutedDate + "']/span");
		driver.findElement(By.xpath("//tbody[4]/tr[5]/td[6]/span")).click();

		// select private type
		driver.findElement(By.xpath("//md-input-container[2]/md-select")).click();
		driver.findElement(By.xpath("//md-option[2]/div")).click();

		// add overview
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(TestUtils.overview);

		// add tag
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input"))
				.sendKeys(TestUtils.ProjectTag);
		Thread.sleep(3000);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button")))
				.sendKeys(Keys.ENTER);

		Thread.sleep(2000);
		// next to add member
		WebElement next = driver.findElement(By.xpath("//ap-tab-one/div/div[2]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		if (next.isEnabled()) {
			next.sendKeys(Keys.ENTER);
		} else {
			log.info("The button NEXT is not clickable!");
		}

		// Invite members to this project
		/*
		 * driver.findElement(By.xpath(
		 * "//div[2]/dmc-add-members-card/div/div[5]/button")).click();
		 * driver.findElement(By.xpath(
		 * "//div[3]/dmc-add-members-card/div/div[5]/button")).click();
		 */

		// submit to create the new project
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		WebElement submit = driver.findElement(By.xpath("//div[2]/button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", submit);
		if (submit.isEnabled()) {
			submit.sendKeys(Keys.ENTER);
		} else {
			log.log(Level.INFO, "The button submit is not clickable!");
		}
		
		Thread.sleep(2000);
		System.out.println(driver.getCurrentUrl());
		return driver.getCurrentUrl();
	}

}
