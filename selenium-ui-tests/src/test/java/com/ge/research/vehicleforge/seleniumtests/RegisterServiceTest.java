package com.ge.research.vehicleforge.seleniumtests;
import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.junit.Ignore;
import org.openqa.selenium.*;

public class RegisterServiceTest extends BaseTest {
	int num = TestUtils.ran;
	private String serviceName = "AppliedLoad " + num;
	private String serviceDes = "This is the description for service AppliedLoad " + num;
	private String serviceTag = "alpha " + num;

	@Ignore
	@Test
	public void testRegisterService() throws Exception {
		AddProjectFromMyProjectsPageTest addProject = new AddProjectFromMyProjectsPageTest();
		addProject.addProjectFromMyProjectsPageTest();
		driver.findElement(By.xpath("//div[2]/div[2]/div/md-toolbar/div/a")).click();
		//driver.get(baseUrl + "/project.php#/18/services");

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.findElement(By.linkText("REGISTER SERVICES")).click();
		driver.findElement(By.xpath("//md-input-container[2]/button")).click();
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[1]/input")).clear();
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[1]/input")).sendKeys("OA Server");
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[2]/input")).clear();
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[2]/input")).sendKeys(domeUrl);
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[3]/input")).clear();
	    driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[1]/div[1]/div/form/div/md-input-container[3]/input")).sendKeys(port);
	    driver.findElement(By.xpath("//md-input-container[5]/button")).click();
		/*driver.findElement(By.xpath("//md-select")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-option[16]/div")));
		element.click();*/

		// choose Alpha service to register
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//li/div")).click();
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//li/div")).click();
		Thread.sleep(TestUtils.sleep3Second);
		
		WebElement next = driver.findElement(By.xpath("html/body/div[2]/ui-view/div[2]/div[2]/div[3]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		next.sendKeys(Keys.ENTER);
		Thread.sleep(TestUtils.sleep3Second);

		// Edit content of REGISTER SERVICE page
		WebElement serviceType = driver.findElement(By.xpath("//md-input-container[2]/md-select"));
		jse.executeScript("arguments[0].scrollIntoView(true);", serviceType);
		serviceType.sendKeys(Keys.ENTER);;
		driver.findElement(By.xpath("//md-option[1]")).click();
		driver.findElement(By.xpath("//input")).clear();
		driver.findElement(By.xpath("//input")).sendKeys(serviceName);
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(serviceDes);
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).sendKeys(serviceTag);
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
		WebElement submit = driver.findElement(By.xpath("//button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", submit);
		submit.sendKeys(Keys.ENTER);

		//assertEquals("Alpha", driver.findElement(By.linkText("Alpha" + TestUtils.ran)).getText());

		driver.findElement(By.xpath("//div[2]/a/span")).click();
		Thread.sleep(TestUtils.sleep5Second);
		//assertEquals("Status: Not Running", driver.findElement(By.xpath("//h3")).getText());
		driver.findElement(By.xpath("//button[2]")).click();
		//assertEquals("Status: running", driver.findElement(By.xpath("//h3")).getText());
	}

}
