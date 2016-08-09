
public class MyThread extends Thread {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        MyThread myThread = new MyThread();
        while ( !myThread.isAlive()) {
        	myThread.start();
        }
        
      
	}
	
	public void run () {
		System.out.println("In run");
	}

}
