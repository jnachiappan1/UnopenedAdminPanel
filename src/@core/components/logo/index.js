// import { isPercentage } from "src/utils/utils";

// const Logo = ({ width = 200, height }) => {
//   let renderHeight = height;
//   let isWidthPercentage = isPercentage(width);
//   if (!isWidthPercentage) {
//     if (!renderHeight) {
//       renderHeight = width / (150 / 66);
//     } else if (!width || !height) {
//       renderHeight = 66;
//     }
//   }

//   return (
//     <svg
//       width={width}
//       height={renderHeight}
//       viewBox="0 0 754 644"
//       fill="none"
//       version="1.0"
//       style={{
//         shapeRendering: "geometricPrecision",
//         textRendering: "geometricPrecision",
//         imageRendering: "optimizeQuality",
//         fillRule: "evenodd",
//         clipRule: "evenodd",
//       }}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <defs>
//           <style>
//             {`
//        .fil0 { fill: #FEFEFE; fill-rule: nonzero; }
//        .fil1 { fill: #31AD52; fill-rule: nonzero; }
//      `}
//           </style>
//         </defs>
//       </defs>
//       <path
//         d="M373.145 0.50696C376.064 -0.237471 378.728 -0.237467 381.51 1.01631L592.047 103.963V341.006L378.493 452.808C371.186 453.121 354.554 443.091 346.874 439.271C291.414 411.648 226.845 379.05 173.794 347.882C168.994 345.061 161.668 342.514 161.962 336.206L163.039 103.924L373.184 0.50696H373.145ZM376.554 34.1435L213.014 114.718L273.685 146.2L282.932 145.554L440.183 65.7622L376.554 34.1631V34.1435ZM542.092 115.678L479.403 83.2172L474.975 82.7274L315.412 162.244L312.905 166.593L378.199 197.527L542.092 115.659V115.678ZM563.641 139.206L393.205 223.445V409.552L563.641 320.416V139.206ZM293.295 231.281L262.91 215.628L260.031 173.45L191.445 141.146V323.335L361.88 411.492V226.363L293.314 192.08V231.261L293.295 231.281Z"
//         class="fil1"
//       />
//       <path
//         d="M484.581 541.333L506.13 542.312L543.352 598.145V541.333H566.86V639.284L543.744 638.873L506.13 582.472V639.284H484.581V541.333Z"
//        class="fil1"
//       />
//       <path
//         d="M100.611 541.333L123.728 541.744L159.382 596.186V541.333H180.931V639.284L159.774 638.873L122.16 582.472V639.284H100.611V541.333Z"
//         class="fil1"
//       />
//       <path
//         d="M241.168 539.885C311.928 530.639 319.783 638.307 250.375 641.265C185.551 644.027 178.714 548.054 241.168 539.885ZM241.128 561.376C214.231 566.979 212.977 614.936 242.774 619.559C287.871 626.553 285.54 552.149 241.128 561.376Z"
//         class="fil1"
//       />
//       <path
//         d="M670.688 639.284V541.333H710.848C717.803 541.333 736.061 550.54 741.194 556.045C767.915 584.706 747.619 639.284 706.93 639.284H670.688ZM692.237 617.735C710.907 619.224 727.637 617.265 729.557 595.304C731.947 567.897 718.097 559.611 692.237 562.882V617.735Z"
//         class="fil1"
//       />
//       <path
//         d="M24.2057 541.333V608.919C24.2057 622.828 57.5092 622.828 57.5092 608.919V541.333H81.0175V606.96C81.0175 607.666 77.3542 618.538 76.6097 620.184C63.9152 647.865 18.0151 647.532 4.94842 620.36C4.04726 618.499 0.716919 609.977 0.716919 608.919V541.333H24.2253H24.2057Z"
//         class="fil1"
//       />
//       <path
//         d="M464.988 541.333V560.923H426.787C421.419 565.586 424.573 574.068 423.848 580.513H459.111V600.104H423.848C424.573 606.549 421.419 615.031 426.787 619.694H464.988V639.284H402.299V541.333H464.988Z"
//         class="fil1"
//       />
//       <path
//         d="M337.652 605.981V639.284H314.143V541.333H358.222C370.818 541.333 384.786 555.399 386.451 567.936C390.82 601.181 365.509 608.39 337.652 605.981ZM337.652 588.35C373.502 593.717 373.62 554.674 337.652 560.923V588.35Z"
//         class="fil1"
//       />
//       <path
//         d="M649.138 541.333V560.923H609.957V580.513H645.22V600.104H609.957V619.694H651.097V639.284H588.408V541.333H649.138Z"
//         class="fil1"
//       />
      
//     </svg>
//   );
// };

// export default Logo;



import { isPercentage } from "src/utils/utils";
import logo from "../../../assets/images/logo.png"

const Logo = ({ width = 200, height }) => {
  let renderHeight = height;
  let isWidthPercentage = isPercentage(width);
  if (!isWidthPercentage) {
    if (!renderHeight) {
      renderHeight = width / (150 / 66);
    } else if (!width || !height) {
      renderHeight = 66;
    }
  }

  return (
    <img
      src={logo}
      width={width}
      height={renderHeight}
      alt="Logo"
      style={{ objectFit: "contain" }}
    />
  );
};

export default Logo;
